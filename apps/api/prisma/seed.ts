import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedCity {
  name: string;
  country: string;
  region?: string;
  costIndex?: number;
  popularityScore?: number;
  imageUrl?: string;
}

interface SeedActivity {
  name: string;
  cityName: string;
  description?: string;
  category:
    | "SIGHTSEEING"
    | "FOOD"
    | "ADVENTURE"
    | "CULTURE"
    | "SHOPPING"
    | "RELAXATION"
    | "OTHER";
  estimatedCost: number;
  durationMins: number;
  imageUrl?: string;
}

const cities: SeedCity[] = [
  { name: "Jaipur", country: "India", region: "Rajasthan", costIndex: 2, popularityScore: 92 },
  { name: "Udaipur", country: "India", region: "Rajasthan", costIndex: 2, popularityScore: 88 },
  { name: "Jodhpur", country: "India", region: "Rajasthan", costIndex: 2, popularityScore: 76 },
  { name: "Delhi", country: "India", region: "Delhi", costIndex: 3, popularityScore: 90 },
  { name: "Mumbai", country: "India", region: "Maharashtra", costIndex: 3, popularityScore: 85 },
  { name: "Goa", country: "India", region: "Goa", costIndex: 3, popularityScore: 89 },
  { name: "Ahmedabad", country: "India", region: "Gujarat", costIndex: 2, popularityScore: 72 },
  { name: "Bengaluru", country: "India", region: "Karnataka", costIndex: 3, popularityScore: 80 },
  { name: "Hyderabad", country: "India", region: "Telangana", costIndex: 2, popularityScore: 78 },
  { name: "Agra", country: "India", region: "Uttar Pradesh", costIndex: 2, popularityScore: 86 },
  { name: "Varanasi", country: "India", region: "Uttar Pradesh", costIndex: 1, popularityScore: 74 },
  { name: "Manali", country: "India", region: "Himachal Pradesh", costIndex: 2, popularityScore: 70 },
  { name: "Kolkata", country: "India", region: "West Bengal", costIndex: 2, popularityScore: 75 },
  { name: "Paris", country: "France", region: "Île-de-France", costIndex: 4, popularityScore: 95 },
  { name: "Amsterdam", country: "Netherlands", region: "North Holland", costIndex: 4, popularityScore: 87 },
  { name: "Berlin", country: "Germany", region: "Berlin", costIndex: 4, popularityScore: 84 },
  { name: "London", country: "United Kingdom", region: "England", costIndex: 4, popularityScore: 93 },
  { name: "Rome", country: "Italy", region: "Lazio", costIndex: 4, popularityScore: 91 },
  { name: "Tokyo", country: "Japan", region: "Kantō", costIndex: 4, popularityScore: 94 },
  { name: "Dubai", country: "United Arab Emirates", region: "Dubai", costIndex: 4, popularityScore: 88 },
];

const activities: SeedActivity[] = [
  { name: "Amber Fort", cityName: "Jaipur", description: "Historic hilltop fort with sweeping views.", category: "SIGHTSEEING", estimatedCost: 500, durationMins: 180 },
  { name: "City Palace Jaipur", cityName: "Jaipur", description: "Royal palace complex in the old city.", category: "SIGHTSEEING", estimatedCost: 400, durationMins: 150 },
  { name: "Hawa Mahal", cityName: "Jaipur", description: "Iconic honeycomb palace facade.", category: "SIGHTSEEING", estimatedCost: 200, durationMins: 60 },
  { name: "Jantar Mantar", cityName: "Jaipur", description: "Astronomical observatory and sundials.", category: "CULTURE", estimatedCost: 150, durationMins: 90 },
  { name: "Nahargarh Fort", cityName: "Jaipur", description: "Fortress overlooking the city skyline.", category: "SIGHTSEEING", estimatedCost: 300, durationMins: 120 },
  { name: "Jaipur Food Walk", cityName: "Jaipur", description: "Guided street-food tasting tour.", category: "FOOD", estimatedCost: 600, durationMins: 120 },
  { name: "Johari Bazaar Shopping", cityName: "Jaipur", description: "Gemstones, textiles and handicrafts.", category: "SHOPPING", estimatedCost: 1000, durationMins: 120 },

  { name: "City Palace Udaipur", cityName: "Udaipur", description: "Palace on the banks of Lake Pichola.", category: "SIGHTSEEING", estimatedCost: 400, durationMins: 150 },
  { name: "Lake Pichola", cityName: "Udaipur", description: "Scenic lake boat ride.", category: "RELAXATION", estimatedCost: 500, durationMins: 90 },
  { name: "Jag Mandir", cityName: "Udaipur", description: "Island palace in Lake Pichola.", category: "SIGHTSEEING", estimatedCost: 350, durationMins: 120 },
  { name: "Sajjangarh Palace", cityName: "Udaipur", description: "Monsoon palace on a hilltop.", category: "SIGHTSEEING", estimatedCost: 300, durationMins: 120 },
  { name: "Bagore Ki Haveli", cityName: "Udaipur", description: "Heritage haveli with folk performances.", category: "CULTURE", estimatedCost: 250, durationMins: 90 },
  { name: "Udaipur Food Walk", cityName: "Udaipur", description: "Taste local Rajasthani cuisine.", category: "FOOD", estimatedCost: 600, durationMins: 120 },

  { name: "Baga Beach", cityName: "Goa", description: "Popular beach with water sports.", category: "RELAXATION", estimatedCost: 200, durationMins: 180 },
  { name: "Calangute Beach", cityName: "Goa", description: "Long sandy beach stretch.", category: "RELAXATION", estimatedCost: 150, durationMins: 150 },
  { name: "Basilica of Bom Jesus", cityName: "Goa", description: "UNESCO-listed baroque church.", category: "CULTURE", estimatedCost: 100, durationMins: 60 },
  { name: "Dudhsagar Falls", cityName: "Goa", description: "Majestic four-tiered waterfall.", category: "ADVENTURE", estimatedCost: 800, durationMins: 300 },
  { name: "Goa Food Tour", cityName: "Goa", description: "Portuguese-Indian food tasting.", category: "FOOD", estimatedCost: 700, durationMins: 180 },
  { name: "Water Sports at Baga", cityName: "Goa", description: "Jet skiing, parasailing and more.", category: "ADVENTURE", estimatedCost: 1200, durationMins: 120 },

  { name: "Taj Mahal", cityName: "Agra", description: "The iconic marble mausoleum.", category: "SIGHTSEEING", estimatedCost: 1100, durationMins: 180 },
  { name: "Agra Fort", cityName: "Agra", description: "Red sandstone Mughal fortress.", category: "SIGHTSEEING", estimatedCost: 600, durationMins: 150 },
  { name: "Mehtab Bagh", cityName: "Agra", description: "Garden view of the Taj across the river.", category: "RELAXATION", estimatedCost: 300, durationMins: 60 },
  { name: "Itmad-ud-Daulah", cityName: "Agra", description: "The 'Baby Taj' tomb.", category: "SIGHTSEEING", estimatedCost: 250, durationMins: 90 },
  { name: "Local Food Tour", cityName: "Agra", description: "Street food of Agra.", category: "FOOD", estimatedCost: 500, durationMins: 120 },

  { name: "Red Fort", cityName: "Delhi", description: "Mughal fort complex.", category: "SIGHTSEEING", estimatedCost: 600, durationMins: 150 },
  { name: "Qutub Minar", cityName: "Delhi", description: "UNESCO-listed minaret.", category: "SIGHTSEEING", estimatedCost: 300, durationMins: 90 },
  { name: "India Gate", cityName: "Delhi", description: "National war memorial.", category: "SIGHTSEEING", estimatedCost: 100, durationMins: 60 },
  { name: "Chandni Chowk Food Walk", cityName: "Delhi", description: "Old Delhi street food.", category: "FOOD", estimatedCost: 600, durationMins: 150 },

  { name: "Gateway of India", cityName: "Mumbai", description: "Historic arch monument.", category: "SIGHTSEEING", estimatedCost: 100, durationMins: 60 },
  { name: "Marine Drive", cityName: "Mumbai", description: "Scenic seaside promenade.", category: "RELAXATION", estimatedCost: 100, durationMins: 90 },
  { name: "Elephanta Caves", cityName: "Mumbai", description: "Rock-cut temple caves.", category: "CULTURE", estimatedCost: 500, durationMins: 240 },

  { name: "Eiffel Tower", cityName: "Paris", description: "The world-famous iron tower.", category: "SIGHTSEEING", estimatedCost: 2600, durationMins: 120 },
  { name: "Louvre Museum", cityName: "Paris", description: "World's largest art museum.", category: "CULTURE", estimatedCost: 1700, durationMins: 240 },
  { name: "Seine Cruise", cityName: "Paris", description: "Boat tour along the Seine.", category: "RELAXATION", estimatedCost: 1500, durationMins: 60 },
  { name: "Montmartre", cityName: "Paris", description: "Artist quarter and Sacré-Cœur.", category: "CULTURE", estimatedCost: 500, durationMins: 180 },
  { name: "Notre-Dame Area", cityName: "Paris", description: "Historic island district.", category: "SIGHTSEEING", estimatedCost: 400, durationMins: 90 },

  { name: "Rijksmuseum", cityName: "Amsterdam", description: "Dutch national museum.", category: "CULTURE", estimatedCost: 2000, durationMins: 240 },
  { name: "Van Gogh Museum", cityName: "Amsterdam", description: "Largest Van Gogh collection.", category: "CULTURE", estimatedCost: 1900, durationMins: 150 },
  { name: "Canal Cruise", cityName: "Amsterdam", description: "Boat ride through the canals.", category: "RELAXATION", estimatedCost: 1600, durationMins: 60 },
  { name: "Anne Frank House", cityName: "Amsterdam", description: "Historic museum and memorial.", category: "CULTURE", estimatedCost: 1600, durationMins: 120 },
  { name: "Jordaan Walk", cityName: "Amsterdam", description: "Explore the scenic Jordaan district.", category: "CULTURE", estimatedCost: 300, durationMins: 120 },

  { name: "Brandenburg Gate", cityName: "Berlin", description: "Iconic city landmark.", category: "SIGHTSEEING", estimatedCost: 300, durationMins: 60 },
  { name: "Museum Island", cityName: "Berlin", description: "Cluster of world-class museums.", category: "CULTURE", estimatedCost: 1800, durationMins: 300 },
  { name: "Berlin Wall Memorial", cityName: "Berlin", description: "Remains of the Berlin Wall.", category: "CULTURE", estimatedCost: 300, durationMins: 90 },
  { name: "Reichstag", cityName: "Berlin", description: "Historic parliament building.", category: "SIGHTSEEING", estimatedCost: 500, durationMins: 90 },
  { name: "Alexanderplatz", cityName: "Berlin", description: "Central public square.", category: "SHOPPING", estimatedCost: 300, durationMins: 120 },
];

async function main(): Promise<void> {
  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: slug(city.name) },
      update: city,
      create: { id: slug(city.name), ...city },
    });
  }

  const cityMap = new Map<string, string>();
  for (const city of cities) {
    cityMap.set(city.name, slug(city.name));
  }

  for (const activity of activities) {
    const cityId = cityMap.get(activity.cityName);
    if (!cityId) {
      console.warn(`Skipping activity "${activity.name}": unknown city "${activity.cityName}"`);
      continue;
    }
    const { cityName: _cityName, ...data } = activity;
    await prisma.activity.upsert({
      where: { id: slug(activity.name) },
      update: { ...data, cityId },
      create: { id: slug(activity.name), ...data, cityId },
    });
  }

  console.log(
    `Seeding complete: ${cities.length} cities, ${activities.length} activities.`
  );
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });