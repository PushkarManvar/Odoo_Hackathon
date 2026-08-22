export interface BudgetBreakdownByStop {
  stopId: string;
  cityName: string;
  cost: number;
}

export interface BudgetBreakdownByCategory {
  category: string;
  cost: number;
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
  breakdownByStop: BudgetBreakdownByStop[];
  breakdownByCategory: BudgetBreakdownByCategory[];
}