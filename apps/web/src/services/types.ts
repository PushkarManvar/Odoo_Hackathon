export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string | null;
  costIndex: number | null;
  popularityScore: number | null;
  imageUrl: string | null;
}

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number;
  durationMins: number;
  imageUrl: string | null;
}

export interface TripSummary {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  plannedBudget: number | null;
  currency: string;
  visibility: "PRIVATE" | "PUBLIC";
  stopCount: number;
  createdAt: string;
}

export interface TripStopCity {
  id: string;
  name: string;
  country: string;
  region: string | null;
  imageUrl: string | null;
}

export interface TripItem {
  id: string;
  activityId: string | null;
  customName: string | null;
  customCost: number | null;
  date: string;
  startTime: string | null;
  durationMins: number | null;
  sequenceOrder: number;
  notes: string | null;
  activity: Activity | null;
}

export interface TripStop {
  id: string;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  notes: string | null;
  city: TripStopCity | null;
  items: TripItem[];
}

export interface TripDetail {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  plannedBudget: number | null;
  transportCost: number;
  stayCost: number;
  mealCost: number;
  currency: string;
  visibility: "PRIVATE" | "PUBLIC";
  shareSlug: string | null;
  stops: TripStop[];
}

export interface CreateTripInput {
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl?: string | null;
  plannedBudget?: number | null;
  transportCost?: number;
  stayCost?: number;
  mealCost?: number;
  currency?: string;
}

export interface UpdateTripInput {
  name?: string;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  coverImageUrl?: string | null;
  plannedBudget?: number | null;
  transportCost?: number;
  stayCost?: number;
  mealCost?: number;
  currency?: string;
}

export interface CreateStopInput {
  cityId: string;
  arrivalDate: string;
  departureDate: string;
  notes?: string | null;
}

export interface UpdateStopInput {
  arrivalDate?: string;
  departureDate?: string;
  notes?: string | null;
}

export interface CreateItemInput {
  activityId?: string;
  customName?: string;
  customCost?: number;
  date: string;
  startTime?: string | null;
  durationMins?: number;
  notes?: string | null;
}

export interface UpdateItemInput {
  customCost?: number;
  date?: string;
  startTime?: string | null;
  durationMins?: number;
  notes?: string | null;
}

export interface BudgetSummary {
  currency: string;
  plannedBudget: number | null;
  estimatedTotal: number;
  remaining: number | null;
  overBudgetAmount: number;
  averagePerDay: number;
  tripDayCount: number;
  isOverBudget: boolean;
  breakdown: {
    transport: number;
    stay: number;
    meals: number;
    activities: number;
  };
  breakdownByStop: { stopId: string; cityName: string; cost: number }[];
  breakdownByCategory: { category: string; cost: number }[];
}

export interface ShareResult {
  visibility: "PRIVATE" | "PUBLIC";
  shareSlug: string | null;
  publicPath: string | null;
}

export interface PublicTripStop {
  id: string;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  city: { name: string; country: string; region: string | null } | null;
  items: {
    id: string;
    name: string;
    date: string;
    startTime: string | null;
    durationMins: number | null;
    cost: number;
    category: string;
  }[];
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
  stops: PublicTripStop[];
  budget: { estimatedTotal: number; currency: string };
}

export interface CopyTripResult {
  trip: { id: string; name: string; visibility: "PRIVATE"; shareSlug: null };
}