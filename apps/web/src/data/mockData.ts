import { Trip, Activity, ItineraryItem, CommunityPost, UserProfile, AdminMetric } from '../types';

export const mockUserProfile: UserProfile = {
  id: 'usr_1',
  name: 'Preet Sharma',
  handle: '@preet_explorer',
  email: 'preet@globetrotter.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bio: 'Mindful traveler & eco-enthusiast. Exploring hidden gems across Asia & Europe with zero plastic waste.',
  tripsPlanned: 18,
  countriesVisited: 14,
  totalDistanceKm: 42800,
  ecoScore: 94,
  badges: [
    { id: 'b1', name: 'Zero Carbon Hero', icon: 'forest', description: 'Offset over 1,000kg of CO2 emissions across 5 trips.' },
    { id: 'b2', name: 'Cultural Explorer', icon: 'temple_buddhist', description: 'Visited over 30 heritage sites & local workshops.' },
    { id: 'b3', name: 'Master Planner', icon: 'edit_calendar', description: 'Created 10+ public itineraries rated 5 stars by the community.' },
    { id: 'b4', name: 'Alpine Hiker', icon: 'hiking', description: 'Completed 5 mountain trail expeditions.' }
  ],
  preferences: ['Eco-Friendly', 'Culinary & Local Food', 'Heritage & History', 'Hiking & Trails', 'Budget conscious']
};

export const mockTrips: Trip[] = [
  {
    id: 'trip_1',
    title: 'Kyoto Autumn Heritage & Bamboo Forests',
    destination: 'Kyoto',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    status: 'upcoming',
    budget: 2400,
    spentBudget: 1150,
    travelersCount: 2,
    travelStyle: ['Eco-Friendly', 'Culture', 'Heritage'],
    ecoPoints: 450,
    description: 'A serene week exploring hidden tea houses, Arashiyama bamboo groves, and ancient wooden temples.',
    daysCount: 7,
    isPublic: true
  },
  {
    id: 'trip_2',
    title: 'Amalfi Coast Slow Living Expedition',
    destination: 'Positano & Amalfi',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    status: 'upcoming',
    budget: 3200,
    spentBudget: 800,
    travelersCount: 2,
    travelStyle: ['Culinary', 'Relaxation', 'Coastal'],
    ecoPoints: 320,
    description: 'Hike Path of the Gods, savor lemon orchards, and sail along cliffside coastal villages.',
    daysCount: 7,
    isPublic: true
  },
  {
    id: 'trip_3',
    title: 'Swiss Alps Green Hiking & Rail Odyssey',
    destination: 'Interlaken & Zermatt',
    country: 'Switzerland',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-06-10',
    endDate: '2026-06-18',
    status: 'completed',
    budget: 4000,
    spentBudget: 3850,
    travelersCount: 1,
    travelStyle: ['Adventure', 'Alpine', 'Rail'],
    ecoPoints: 680,
    description: 'Glacier views, alpine trail runs, and electric mountain railways across Jungfrau region.',
    daysCount: 8,
    isPublic: true
  },
  {
    id: 'trip_4',
    title: 'Paris Art, Architecture & Vegan Bakeries',
    destination: 'Paris',
    country: 'France',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
    startDate: '2026-11-20',
    endDate: '2026-11-25',
    status: 'draft',
    budget: 1800,
    spentBudget: 300,
    travelersCount: 2,
    travelStyle: ['Art', 'Culinary', 'City Walk'],
    ecoPoints: 210,
    description: 'Exploring Le Marais hidden courtyards, Louvre night tour, and organic eco-cafes.',
    daysCount: 5,
    isPublic: false
  }
];

export const mockItineraryItems: Record<string, ItineraryItem[]> = {
  'trip_1': [
    {
      id: 'it_1',
      dayNumber: 1,
      timeSlot: 'Morning',
      time: '08:00 AM',
      title: 'Arashiyama Bamboo Grove Walk',
      category: 'Nature',
      location: 'Ukyo Ward, Kyoto',
      cost: 0,
      notes: 'Arrive early before sunrise to capture quiet light and avoid crowds.',
      status: 'pending'
    },
    {
      id: 'it_2',
      dayNumber: 1,
      timeSlot: 'Morning',
      time: '10:30 AM',
      title: 'Tenryu-ji Temple Garden Tour',
      category: 'Culture',
      location: 'Arashiyama, Kyoto',
      cost: 15,
      notes: 'Unesco world heritage site. Magnificent zen garden view.',
      status: 'pending'
    },
    {
      id: 'it_3',
      dayNumber: 1,
      timeSlot: 'Afternoon',
      time: '01:00 PM',
      title: 'Traditional Shojin Ryori Vegan Lunch',
      category: 'Food',
      location: 'Shigetsu Temple Restaurant',
      cost: 45,
      notes: 'Buddhist monk culinary feast made with organic seasonal mountain vegetables.',
      status: 'pending'
    },
    {
      id: 'it_4',
      dayNumber: 1,
      timeSlot: 'Evening',
      time: '06:00 PM',
      title: 'Gion Evening Lantern Stroll & Tea Ceremony',
      category: 'Culture',
      location: 'Gion District',
      cost: 60,
      notes: 'Private match tea ceremony with master in historic Machiya townhouse.',
      status: 'pending'
    },
    {
      id: 'it_5',
      dayNumber: 2,
      timeSlot: 'Morning',
      time: '07:30 AM',
      title: 'Fushimi Inari Torii Gate Hike',
      category: 'Nature',
      location: 'Fushimi Ward',
      cost: 0,
      notes: 'Ascend all 4,000 vermilion torii gates to the mountain summit.',
      status: 'pending'
    }
  ]
};

export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    title: 'Matcha Tea Whisking Workshop & Garden Tasting',
    category: 'Culture',
    location: 'Higashiyama',
    city: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 128,
    price: 55,
    duration: '2 hours',
    description: 'Learn the ritual technique of preparing Uji ceremonial grade matcha from a 5th-generation tea artisan.',
    ecoBadge: '100% Zero Plastic'
  },
  {
    id: 'act_2',
    title: 'Path of the Gods Cliffside Hike & Farm Lunch',
    category: 'Adventure',
    location: 'Nocelle to Bomerano',
    city: 'Amalfi Coast',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    rating: 4.95,
    reviewsCount: 310,
    price: 40,
    duration: '4.5 hours',
    description: 'Breathtaking ridge walk overviewing the Mediterranean Sea followed by fresh mozzarella tasting.',
    ecoBadge: 'Carbon Offset Included'
  },
  {
    id: 'act_3',
    title: 'Kiyomizu-dera Sunrise Temple Walk',
    category: 'Nature',
    location: 'Higashiyama',
    city: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800',
    rating: 4.85,
    reviewsCount: 240,
    price: 12,
    duration: '2.5 hours',
    description: 'Witness panoramic views over Kyoto valley from the famous wooden temple balcony built without nails.',
    ecoBadge: 'Heritage Certified'
  },
  {
    id: 'act_4',
    title: 'Electric E-Bike Tour of Positano Lemongroves',
    category: 'Adventure',
    location: 'Positano Coast Road',
    city: 'Positano',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800',
    rating: 4.78,
    reviewsCount: 95,
    price: 75,
    duration: '3 hours',
    description: 'Glide effortlessly along winding seaside cliffs and stop at family-run organic limoncello orchards.',
    ecoBadge: 'Zero Emission Transport'
  },
  {
    id: 'act_5',
    title: 'Authentic Pasta Making Class with Nonna',
    category: 'Food',
    location: 'Ravello',
    city: 'Amalfi Coast',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 420,
    price: 85,
    duration: '3.5 hours',
    description: 'Hand-roll fresh tagliatelle and gnocchi using organic wheat sourced directly from Campania local farms.',
    ecoBadge: 'Farm to Table'
  },
  {
    id: 'act_6',
    title: 'Night Kayak & Bioluminescent Algae Discovery',
    category: 'Adventure',
    location: 'Sorrento Bay',
    city: 'Sorrento',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    rating: 4.92,
    reviewsCount: 180,
    price: 65,
    duration: '2 hours',
    description: 'Paddle glowing blue waters under starry skies guided by marine conservation experts.',
    ecoBadge: 'Eco Marine Award'
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    title: '7 Days Eco Trekking Across Hokkaido Hidden Lakes',
    destination: 'Hokkaido, Japan',
    durationDays: 7,
    upvotes: 412,
    bookmarksCount: 189,
    tags: ['Eco Trekking', 'Volcanoes', 'Hot Springs', 'Wildlife'],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    description: 'Avoided all tourist buses! Used local electric trains and stayed in solar-powered mountain lodges.',
    createdAt: '2 days ago',
    hasUpvoted: true,
    hasBookmarked: false
  },
  {
    id: 'post_2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    title: 'Ultimate 10-Day Vegan Foodie Itinerary in Southern Italy',
    destination: 'Puglia & Amalfi',
    durationDays: 10,
    upvotes: 890,
    bookmarksCount: 520,
    tags: ['Culinary', 'Vegan', 'Slow Travel', 'Organic'],
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1000',
    description: 'Every single restaurant tested for authentic organic ingredients, zero-kilometer olive oil, and handmade bread.',
    createdAt: '5 days ago',
    hasUpvoted: false,
    hasBookmarked: true
  },
  {
    id: 'post_3',
    authorName: 'Aria Montgomery',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    title: 'Budget Nomad Guide: 2 Weeks in Slovenia Alp Ridges',
    destination: 'Bled & Triglav',
    durationDays: 14,
    upvotes: 640,
    bookmarksCount: 310,
    tags: ['Budget Travel', 'Hiking', 'Wild Camping'],
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
    description: 'Detailed cost breakdown under €35 per day including gear rentals, mountain hut fees, and eco-bus passes.',
    createdAt: '1 week ago',
    hasUpvoted: true,
    hasBookmarked: true
  }
];

export const mockAdminMetric: AdminMetric = {
  totalUsers: 14850,
  activeTrips: 3420,
  totalItinerariesCreated: 42100,
  revenueThisMonth: 184500
};

export const mockAdminUsers = [
  { id: 'u101', name: 'Sophia Miller', email: 'sophia@example.com', role: 'Traveler', status: 'Active', tripsCount: 12, ecoPoints: 850, joinedDate: 'Jan 2026' },
  { id: 'u102', name: 'Liam O\'Connor', email: 'liam@example.com', role: 'Verified Guide', status: 'Active', tripsCount: 34, ecoPoints: 2100, joinedDate: 'Feb 2026' },
  { id: 'u103', name: 'Hiroshi Tanaka', email: 'tanaka@example.com', role: 'Community Mod', status: 'Active', tripsCount: 28, ecoPoints: 1750, joinedDate: 'Nov 2025' },
  { id: 'u104', name: 'Camila Rodriguez', email: 'camila@example.com', role: 'Traveler', status: 'Pending Review', tripsCount: 3, ecoPoints: 120, joinedDate: 'Aug 2026' },
  { id: 'u105', name: 'David Vance', email: 'vance@example.com', role: 'Traveler', status: 'Suspended', tripsCount: 0, ecoPoints: 0, joinedDate: 'Jul 2026' }
];
