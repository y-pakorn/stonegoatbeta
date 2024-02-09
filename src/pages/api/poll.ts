import { Beta } from "@/interfaces/beta";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not defined");
  }
  if (!process.env.DB_API_KEY) {
    throw new Error("DB_API_KEY is not defined");
  }
  if (!process.env.BETA_ENDPOINT) {
    throw new Error("BETA_ENDPOINT is not defined");
  }
  if (!process.env.IMAGE_URL_PREFIX) {
    throw new Error("IMAGE_URL_PREFIX is not defined");
  }

  const supabase = createClient(process.env.DB_URL, process.env.DB_API_KEY);

  const betas: Beta[] = [];
  const response = await axios.get(process.env.BETA_ENDPOINT);
  betas.push(...response.data.data);

  const latestBeta: Beta | undefined = await supabase
    .from("betas")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .then((res) => res.data?.[0]);

  const filteredBetas = latestBeta
    ? betas.filter(
        (beta) => new Date(beta.timestamp) > new Date(latestBeta.timestamp)
      )
    : betas;

  if (filteredBetas.length === 0) {
    res.status(200).json({ status: "OK", message: "No new betas" });
    return;
  }

  const betasToInsert = await Promise.all(
    filteredBetas.map(async (beta) => {
      const imageData = await axios.get(beta.thumbnail_url, {
        responseType: "arraybuffer",
      });
      const compressedImageData = await sharp(imageData.data)
        .resize(360, 640)
        .jpeg({
          mozjpeg: true,
        })
        .toBuffer();
      const result = await supabase.storage
        .from("beta-thumbnails")
        .upload(`/${beta.id}.jpeg`, compressedImageData, {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (result.error) {
        throw result.error;
      }
      const image_url = `${process.env.IMAGE_URL_PREFIX}/${beta.id}.jpeg`;
      beta.thumbnail_url = image_url;
      delete (beta as any).media_type;
      delete (beta as any).media_url;
      return beta;
    })
  );

  await supabase.from("betas").insert(betasToInsert).throwOnError();
  await supabase.rpc("refresh").throwOnError();

  res
    .status(200)
    .json({ status: "OK", message: `Inserted ${betasToInsert.length} rows` });
}
