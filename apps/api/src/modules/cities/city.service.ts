import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import type { CitySummary } from "./city.types.js";
import type { ListCitiesQuery } from "./city.validation.js";

function toSummary(city: {
  id: string;
  name: string;
  country: string;
  region: string | null;
  costIndex: number | null;
  popularityScore: number | null;
  imageUrl: string | null;
}): CitySummary {
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    region: city.region,
    costIndex: city.costIndex,
    popularityScore: city.popularityScore,
    imageUrl: city.imageUrl,
  };
}

export async function listCities(query: ListCitiesQuery): Promise<CitySummary[]> {
  const { search, country, region, sort, limit } = query;

  const cities = await prisma.city.findMany({
    where: {
      ...(search
        ? { name: { contains: search, mode: "insensitive" } }
        : {}),
      ...(country
        ? { country: { contains: country, mode: "insensitive" } }
        : {}),
      ...(region
        ? { region: { contains: region, mode: "insensitive" } }
        : {}),
    },
    orderBy:
      sort === "name"
        ? { name: "asc" }
        : { popularityScore: { sort: "desc", nulls: "last" } },
    take: limit,
  });

  return cities.map(toSummary);
}

export async function getCity(cityId: string): Promise<CitySummary> {
  const city = await prisma.city.findUnique({ where: { id: cityId } });

  if (!city) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "City not found");
  }

  return toSummary(city);
}