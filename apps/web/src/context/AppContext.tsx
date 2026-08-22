import React, { createContext, useContext, useEffect, useState } from 'react';
import { Trip, Activity, ItineraryItem, CommunityPost, UserProfile } from '../types';
import { mockActivities, mockItineraryItems, mockCommunityPosts, mockUserProfile } from '../data/mockData';
import { authApi, tripsApi, getToken, setToken, clearToken, type AuthUser, type BackendTrip } from '../services/api';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200';

function mapBackendTrip(t: BackendTrip): Trip {
  const daysCount = Math.max(
    1,
    Math.round((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 3600 * 24)) + 1
  );
  return {
    id: t.id,
    title: t.name,
    destination: '',
    country: '',
    coverImage: t.coverImageUrl ?? FALLBACK_COVER,
    startDate: t.startDate,
    endDate: t.endDate,
    status: 'upcoming',
    budget: t.plannedBudget ?? 0,
    spentBudget: 0,
    travelersCount: 1,
    travelStyle: [],
    ecoPoints: 0,
    description: t.description ?? '',
    daysCount,
    isPublic: t.visibility === 'PUBLIC',
  };
}

const emptyUserProfile: UserProfile = {
  id: '',
  name: 'Traveler',
  handle: '@traveler',
  email: '',
  avatar: mockUserProfile.avatar,
  bio: 'Plan mindful journeys with Globe Trotter.',
  tripsPlanned: 0,
  countriesVisited: 0,
  totalDistanceKm: 0,
  ecoScore: 0,
  badges: [],
  preferences: [],
};

interface AppContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  trips: Trip[];
  activities: Activity[];
  communityPosts: CommunityPost[];
  itineraries: Record<string, ItineraryItem[]>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createTrip: (newTrip: Omit<Trip, 'id' | 'spentBudget' | 'ecoPoints'>) => Trip;
  updateTrip: (id: string, updatedFields: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, 'id' | 'status'>) => void;
  toggleItineraryStatus: (tripId: string, itemId: string) => void;
  deleteItineraryItem: (tripId: string, itemId: string) => void;
  toggleUpvotePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  notificationsCount: number;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(emptyUserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getToken()));
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities] = useState<Activity[]>(mockActivities);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [itineraries, setItineraries] = useState<Record<string, ItineraryItem[]>>(mockItineraryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(3);

  const createTrip = (newTripData: Omit<Trip, 'id' | 'spentBudget' | 'ecoPoints'>): Trip => {
    const newId = `trip_${Date.now()}`;
    const newTrip: Trip = {
      ...newTripData,
      id: newId,
      spentBudget: 0,
      ecoPoints: Math.floor(Math.random() * 200) + 150,
      daysCount: Math.ceil((new Date(newTripData.endDate).getTime() - new Date(newTripData.startDate).getTime()) / (1000 * 3600 * 24)) || 5
    };
    setTrips(prev => [newTrip, ...prev]);
    setItineraries(prev => ({ ...prev, [newId]: [] }));
    return newTrip;
  };

  const updateTrip = (id: string, updatedFields: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const addItineraryItem = (tripId: string, itemData: Omit<ItineraryItem, 'id' | 'status'>) => {
    const newItem: ItineraryItem = {
      ...itemData,
      id: `it_${Date.now()}`,
      status: 'pending'
    };
    setItineraries(prev => {
      const existing = prev[tripId] || [];
      return { ...prev, [tripId]: [...existing, newItem] };
    });
    // update trip spent budget
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, spentBudget: t.spentBudget + itemData.cost } : t));
  };

  const toggleItineraryStatus = (tripId: string, itemId: string) => {
    setItineraries(prev => {
      const existing = prev[tripId] || [];
      return {
        ...prev,
        [tripId]: existing.map(item => item.id === itemId ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } : item)
      };
    });
  };

  const deleteItineraryItem = (tripId: string, itemId: string) => {
    setItineraries(prev => {
      const existing = prev[tripId] || [];
      const itemToDelete = existing.find(i => i.id === itemId);
      if (itemToDelete) {
        setTrips(tList => tList.map(t => t.id === tripId ? { ...t, spentBudget: Math.max(0, t.spentBudget - itemToDelete.cost) } : t));
      }
      return { ...prev, [tripId]: existing.filter(i => i.id !== itemId) };
    });
  };

  const toggleUpvotePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasUpvoted = !p.hasUpvoted;
        return {
          ...p,
          hasUpvoted,
          upvotes: hasUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  };

  const toggleBookmarkPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasBookmarked = !p.hasBookmarked;
        return {
          ...p,
          hasBookmarked,
          bookmarksCount: hasBookmarked ? p.bookmarksCount + 1 : p.bookmarksCount - 1
        };
      }
      return p;
    }));
  };

  const clearNotifications = () => {
    setNotificationsCount(0);
  };

  const applyAuthUser = (authUser: AuthUser) => {
    setUser(prev => ({
      ...prev,
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      handle: `@${authUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      tripsPlanned: 0,
      countriesVisited: 0,
      totalDistanceKm: 0,
      ecoScore: 0,
      badges: [],
      preferences: [],
    }));
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    setToken(result.token);
    applyAuthUser(result.user);
    await loadUserTrips();
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authApi.signup({ name, email, password });
    setToken(result.token);
    applyAuthUser(result.user);
    await loadUserTrips();
  };

  const loadUserTrips = async () => {
    try {
      const backendTrips = await tripsApi.list();
      const mappedTrips = backendTrips.map(mapBackendTrip);
      setTrips(mappedTrips);
      setUser(prev => ({ ...prev, tripsPlanned: mappedTrips.length }));
    } catch {
      setTrips([]);
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(emptyUserProfile);
    setTrips([]);
  };

  useEffect(() => {
    if (!getToken()) return;

    const restoreSession = async () => {
      try {
        const authUser = await authApi.me();
        applyAuthUser(authUser);
        await loadUserTrips();
      } catch {
        clearToken();
        setIsAuthenticated(false);
        setUser(emptyUserProfile);
        setTrips([]);
      }
    };

    void restoreSession();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        trips,
        activities,
        communityPosts,
        itineraries,
        searchQuery,
        setSearchQuery,
        createTrip,
        updateTrip,
        deleteTrip,
        addItineraryItem,
        toggleItineraryStatus,
        deleteItineraryItem,
        toggleUpvotePost,
        toggleBookmarkPost,
        notificationsCount,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
