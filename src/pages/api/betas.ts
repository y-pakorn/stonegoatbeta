import { axios } from "@/constants/axios";
import { Beta } from "@/interfaces/beta";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  betas: Beta[];
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!process.env.BETA_ENDPOINT) {
    throw new Error("BETA_ENDPOINT is not defined");
  }
  const betas: Beta[] = [];
  const response = await axios.get(process.env.BETA_ENDPOINT);

  betas.push(...response.data.data);

  res.setHeader("Cache-Control", "public, s-maxage=600");
  res.status(200).json({ betas });
}
