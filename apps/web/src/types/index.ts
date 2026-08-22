export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'draft' | 'completed' | 'shared';
  budget: number;
  spentBudget: number;
  travelersCount: number;
  travelStyle: string[];
  ecoPoints: number;
  description: string;
  daysCount: number;
  isPublic?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: 'Food' | 'Nature' | 'Culture' | 'Adventure' | 'Shopping';
  location: string;
  city: string;
  image: string;
  rating: number;
  reviewsCount: number;
  price: number;
  duration: string;
  description: string;
  ecoBadge?: string;
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  title: string;
  category: string;
  location: string;
  cost: number;
  notes: string;
  status: 'completed' | 'pending';
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  destination: string;
  durationDays: number;
  upvotes: number;
  bookmarksCount: number;
  tags: string[];
  coverImage: string;
  description: string;
  createdAt: string;
  hasUpvoted?: boolean;
  hasBookmarked?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  tripsPlanned: number;
  countriesVisited: number;
  totalDistanceKm: number;
  ecoScore: number;
  badges: Array<{ id: string; name: string; icon: string; description: string }>;
  preferences: string[];
}

export interface AdminMetric {
  totalUsers: number;
  activeTrips: number;
  totalItinerariesCreated: number;
  revenueThisMonth: number;
}
