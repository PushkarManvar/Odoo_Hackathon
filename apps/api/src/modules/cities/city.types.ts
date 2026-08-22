export interface CitySummary {
  id: string;
  name: string;
  country: string;
  region: string | null;
  costIndex: number | null;
  popularityScore: number | null;
  imageUrl: string | null;
}