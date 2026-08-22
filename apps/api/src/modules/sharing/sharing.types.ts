export interface ShareResult {
  visibility: "PRIVATE" | "PUBLIC";
  shareSlug: string | null;
  publicPath: string | null;
}

export interface PublicActivity {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  durationMins: number;
}

export interface PublicItem {
  id: string;
  name: string;
  date: string;
  startTime: string | null;
  durationMins: number | null;
  cost: number;
  category: string;
}

export interface PublicStop {
  id: string;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  city: {
    name: string;
    country: string;
    region: string | null;
  };
  items: PublicItem[];
}

export interface PublicTrip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  currency: string;
  owner: { name: string };
  stops: PublicStop[];
  budget: { estimatedTotal: number; currency: string };
}

export interface CopyTripResult {
  trip: {
    id: string;
    name: string;
    visibility: "PRIVATE";
    shareSlug: null;
  };
}