import { Beta } from "@/interfaces/beta";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const supabase = createClient(process.env.DB_URL, process.env.DB_API_KEY);

  const betas: Beta[] = [];
  const response = await axios.get(process.env.BETA_ENDPOINT);
  betas.push(...response.data.data);

  const latestBeta = await supabase
    .from("betas")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  const betasToInsert = betas.filter(
    (beta) => new Date(beta.timestamp) > new Date(latestBeta.data.timestamp)
  );

  if (betasToInsert.length === 0) {
    res.status(200).json({ status: "NO TO INSERT" });
    return;
  }

  await supabase.from("betas").insert(betasToInsert);

  res.status(200).json({ status: "OK" });
}
