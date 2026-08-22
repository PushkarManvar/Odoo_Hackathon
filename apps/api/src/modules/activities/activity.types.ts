export interface ActivitySummary {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number;
  durationMins: number;
  imageUrl: string | null;
}