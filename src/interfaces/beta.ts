import { GRADES_LABEL } from "@/constants/grades";
import { ZONES } from "@/constants/zones";

export interface Beta {
  caption: string;
  id: string;
  media_url: string;
  media_type: string;
  permalink: string;
  thumbnail_url: string;
  timestamp: string;
}

export interface BetaInfo extends Beta {
  grade: string;
  zone: string;
  month: string;
  instagram: string | null;
  date: Date;
}
