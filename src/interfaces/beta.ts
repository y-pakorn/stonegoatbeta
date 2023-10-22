import { GRADES_LABEL } from "@/constants/grades";

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
  grade: keyof typeof GRADES_LABEL;
  month: string;
  instagram: string | null;
}
