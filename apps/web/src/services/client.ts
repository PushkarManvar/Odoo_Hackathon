import { apiRequest } from "./api.js";
import type {
  Activity,
  AuthResult,
  BudgetSummary,
  City,
  CopyTripResult,
  CreateItemInput,
  CreateStopInput,
  CreateTripInput,
  PublicTrip,
  ShareResult,
  TripDetail,
  TripSummary,
  UpdateItemInput,
  UpdateStopInput,
  UpdateTripInput,
} from "./types.js";

export const authApi = {
  signup: (input: { name: string; email: string; password: string }) =>
    apiRequest<AuthResult>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: () => apiRequest<{ id: string; name: string; email: string }>("/auth/me"),
};

export const citiesApi = {
  list: (params?: { search?: string; country?: string; region?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.country) query.set("country", params.country);
    if (params?.region) query.set("region", params.region);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<City[]>(`/cities${qs ? `?${qs}` : ""}`);
  },
  get: (cityId: string) => apiRequest<City>(`/cities/${cityId}`),
  activities: (
    cityId: string,
    params?: { search?: string; category?: string; maxCost?: number; sort?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.maxCost !== undefined) query.set("maxCost", String(params.maxCost));
    if (params?.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return apiRequest<Activity[]>(`/cities/${cityId}/activities${qs ? `?${qs}` : ""}`);
  },
};

export const tripsApi = {
  list: () => apiRequest<TripSummary[]>("/trips"),
  get: (tripId: string) => apiRequest<TripDetail>(`/trips/${tripId}`),
  create: (input: CreateTripInput) =>
    apiRequest<TripSummary>("/trips", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (tripId: string, input: UpdateTripInput) =>
    apiRequest<TripSummary>(`/trips/${tripId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (tripId: string) =>
    apiRequest<undefined>(`/trips/${tripId}`, { method: "DELETE" }),
};

export const stopsApi = {
  create: (tripId: string, input: CreateStopInput) =>
    apiRequest<{ id: string }>(`/trips/${tripId}/stops`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (stopId: string, input: UpdateStopInput) =>
    apiRequest<{ id: string }>(`/stops/${stopId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (stopId: string) =>
    apiRequest<undefined>(`/stops/${stopId}`, { method: "DELETE" }),
  reorder: (tripId: string, stopIds: string[]) =>
    apiRequest<undefined>(`/trips/${tripId}/stops/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ stopIds }),
    }),
};

export const itemsApi = {
  create: (stopId: string, input: CreateItemInput) =>
    apiRequest<{ id: string }>(`/stops/${stopId}/items`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (itemId: string, input: UpdateItemInput) =>
    apiRequest<{ id: string }>(`/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (itemId: string) =>
    apiRequest<undefined>(`/items/${itemId}`, { method: "DELETE" }),
  reorder: (stopId: string, date: string, itemIds: string[]) =>
    apiRequest<undefined>(`/stops/${stopId}/items/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ date, itemIds }),
    }),
};

export const budgetApi = {
  get: (tripId: string) => apiRequest<BudgetSummary>(`/trips/${tripId}/budget`),
};

export const sharingApi = {
  publish: (tripId: string) =>
    apiRequest<ShareResult>(`/trips/${tripId}/share`, { method: "POST" }),
  unpublish: (tripId: string) =>
    apiRequest<ShareResult>(`/trips/${tripId}/share`, { method: "DELETE" }),
  getPublic: (slug: string) => apiRequest<PublicTrip>(`/public/${slug}`),
  copy: (slug: string) =>
    apiRequest<CopyTripResult>(`/public/${slug}/copy`, { method: "POST" }),
};