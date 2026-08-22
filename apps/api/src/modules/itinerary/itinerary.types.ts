export interface ItineraryActivity {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  durationMins: number;
}

export interface ItineraryItemSummary {
  id: string;
  tripStopId: string;
  activityId: string | null;
  customName: string | null;
  customCost: number | null;
  date: string;
  startTime: string | null;
  durationMins: number | null;
  sequenceOrder: number;
  notes: string | null;
  activity: ItineraryActivity | null;
}