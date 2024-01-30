import { BetaInfo } from "@/interfaces/beta";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  betas: BetaInfo[] | null;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not defined");
  }
  if (!process.env.DB_API_KEY) {
    throw new Error("DB_API_KEY is not defined");
  }

  const supabase = createClient(process.env.DB_URL, process.env.DB_API_KEY);

  const data = await supabase
    .from("detailed_betas")
    .select("*")
    .neq("grade", null)
    .neq("zone", null)
    .order("timestamp", { ascending: false })
    .limit(200);

  res.setHeader("Cache-Control", "public, s-maxage=600");
  res.status(200).json({ betas: data.data });
}
