export interface Beta {
  caption: string;
  id: string;
  media_url: string;
  media_type: string;
  permalink: string;
  thumbnail_url: string;
  timestamp: Date;
}

export interface BetaInfo extends Beta {
  grade: string;
  zone: string;
  month: string | null;
  instagram: string | null;
}
