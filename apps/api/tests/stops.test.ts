import { describe, expect, it } from "vitest";
import {
  createStopSchema,
  reorderStopsSchema,
  updateStopSchema,
} from "../src/modules/stops/stop.validation.js";
import {
  assertWithinTripRange,
  validateReorderIds,
} from "../src/modules/stops/stop.service.js";
import { AppError } from "../src/common/errors/AppError.js";

describe("stop validation", () => {
  it("accepts a valid create stop payload", () => {
    const result = createStopSchema.safeParse({
      cityId: "city-1",
      arrivalDate: "2026-10-01",
      departureDate: "2026-10-03",
      notes: "First stop",
    });
    expect(result.success).toBe(true);
  });

  it("rejects arrivalDate after departureDate", () => {
    const result = createStopSchema.safeParse({
      cityId: "city-1",
      arrivalDate: "2026-10-05",
      departureDate: "2026-10-03",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed dates", () => {
    const result = createStopSchema.safeParse({
      cityId: "city-1",
      arrivalDate: "01/10/2026",
      departureDate: "2026-10-03",
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    const result = updateStopSchema.safeParse({ notes: "Updated stay" });
    expect(result.success).toBe(true);
  });

  it("rejects duplicate ids in reorder payload", () => {
    const result = reorderStopsSchema.safeParse({
      stopIds: ["a", "a"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty reorder payload", () => {
    const result = reorderStopsSchema.safeParse({ stopIds: [] });
    expect(result.success).toBe(false);
  });
});

describe("assertWithinTripRange", () => {
  const tripStart = new Date("2026-10-01T00:00:00.000Z");
  const tripEnd = new Date("2026-10-10T00:00:00.000Z");

  it("passes when stop fits inside trip", () => {
    expect(() =>
      assertWithinTripRange(
        new Date("2026-10-02T00:00:00.000Z"),
        new Date("2026-10-04T00:00:00.000Z"),
        tripStart,
        tripEnd
      )
    ).not.toThrow();
  });

  it("throws when arrival precedes trip start", () => {
    expect(() =>
      assertWithinTripRange(
        new Date("2026-09-30T00:00:00.000Z"),
        new Date("2026-10-02T00:00:00.000Z"),
        tripStart,
        tripEnd
      )
    ).toThrow(AppError);
  });

  it("throws when departure exceeds trip end", () => {
    expect(() =>
      assertWithinTripRange(
        new Date("2026-10-05T00:00:00.000Z"),
        new Date("2026-10-12T00:00:00.000Z"),
        tripStart,
        tripEnd
      )
    ).toThrow(AppError);
  });
});

describe("validateReorderIds", () => {
  it("accepts a full reorder of trip stops", () => {
    expect(validateReorderIds(["b", "a"], ["a", "b"])).toBeNull();
  });

  it("rejects when a stop is missing", () => {
    expect(validateReorderIds(["a"], ["a", "b"])).not.toBeNull();
  });

  it("rejects when a stop does not belong to the trip", () => {
    expect(validateReorderIds(["a", "x"], ["a", "b"])).not.toBeNull();
  });
});