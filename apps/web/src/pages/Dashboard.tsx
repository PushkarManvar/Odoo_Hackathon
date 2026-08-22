import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Award,
  Users
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, trips, activities, communityPosts } = useApp();
  const navigate = useNavigate();

  const upcomingTrip = trips.find(t => t.status === 'upcoming') || trips[0];
  const completedCount = trips.filter(t => t.status === 'completed').length;
  const totalBudgetSpent = trips.reduce((acc, t) => acc + t.spentBudget, 0);

  return (
    <div className="space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="neo-brutal-card p-6 sm:p-8 bg-surface-container-low relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container border-2 border-on-surface rounded-full text-xs font-heading font-bold">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Welcome back, {user.name}!</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Where to next on your mindful journey?
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Plan zero-carbon itineraries, discover authentic local activities, and collaborate with eco-conscious travelers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/trips/new" className="neo-brutal-btn-primary px-5 py-2.5 flex items-center gap-2 text-sm">
              <PlusCircle className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
            <Link to="/explore" className="neo-brutal-btn-white px-5 py-2.5 flex items-center gap-2 text-sm">
              <Compass className="w-4 h-4 text-primary" />
              <span>Explore Activities</span>
            </Link>
          </div>
        </div>

        {/* Decorative badge background */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 opacity-15 pointer-events-none">
          <GlobeIllustration />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-on-surface-variant">Trips Planned</span>
            <div className="p-2 bg-primary-container/20 text-primary border border-on-surface rounded-md">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">{trips.length}</p>
          <span className="text-[11px] text-secondary font-semibold">{completedCount} completed</span>
        </div>

        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-on-surface-variant">Countries Visited</span>
            <div className="p-2 bg-secondary-container/30 text-secondary border border-on-surface rounded-md">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">{user.countriesVisited}</p>
          <span className="text-[11px] text-on-surface-variant font-medium">Asia & Europe</span>
        </div>

        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-on-surface-variant">Total Spent</span>
            <div className="p-2 bg-tertiary-container/20 text-tertiary border border-on-surface rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">${totalBudgetSpent}</p>
          <span className="text-[11px] text-on-surface-variant font-medium">Across active trips</span>
        </div>

        <div className="neo-brutal-card p-5 bg-secondary-container/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold text-on-surface-variant">Eco Points</span>
            <div className="p-2 bg-secondary text-white border border-on-surface rounded-md">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-secondary">{user.ecoScore} pts</p>
          <span className="text-[11px] text-secondary font-bold">Top 5% Eco Traveler</span>
        </div>
      </div>

      {/* Upcoming Trip Hero Feature */}
      {upcomingTrip && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-xl text-on-surface flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Next Upcoming Adventure</span>
            </h2>
            <Link to={`/trips/${upcomingTrip.id}`} className="text-xs font-heading font-bold text-primary hover:underline flex items-center gap-1">
              <span>View Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="neo-brutal-card bg-surface-container-low overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px]">
              <img 
                src={upcomingTrip.coverImage} 
                alt={upcomingTrip.title} 
                className="w-full h-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-on-surface"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white border-2 border-on-surface text-xs font-heading font-bold shadow-brutal-sm rounded-full">
                Upcoming
              </div>
            </div>

            <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{upcomingTrip.destination}, {upcomingTrip.country}</span>
                  <span>•</span>
                  <span>{upcomingTrip.daysCount} Days</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-on-surface mb-2">
                  {upcomingTrip.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {upcomingTrip.description}
                </p>
              </div>

              {/* Progress & Budget */}
              <div className="space-y-2 pt-2 border-t-2 border-on-surface/20">
                <div className="flex justify-between text-xs font-bold">
                  <span>Budget Tracker (${upcomingTrip.spentBudget} / ${upcomingTrip.budget})</span>
                  <span className="text-primary">{Math.round((upcomingTrip.spentBudget / upcomingTrip.budget) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-surface-container-high border-2 border-on-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(100, (upcomingTrip.spentBudget / upcomingTrip.budget) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link to={`/trips/${upcomingTrip.id}`} className="neo-brutal-btn-primary px-4 py-2 text-xs">
                  View Full Schedule
                </Link>
                <Link to={`/trips/${upcomingTrip.id}/builder`} className="neo-brutal-btn-white px-4 py-2 text-xs">
                  Edit Builder
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Sustainable Activities & Community Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommended Activities */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-on-surface flex items-center gap-2">
              <Compass className="w-5 h-5 text-secondary" />
              <span>Recommended Local Experiences</span>
            </h2>
            <Link to="/explore" className="text-xs font-heading font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="neo-brutal-card p-3 bg-surface-container-lowest flex gap-4 items-center">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-on-surface flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded-full">
                    {activity.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-on-surface truncate mt-1">
                    {activity.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                    <span>{activity.location}, {activity.city}</span>
                    <span className="font-bold text-primary">${activity.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Feed Preview */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-on-surface flex items-center gap-2">
              <Users className="w-5 h-5 text-tertiary" />
              <span>Trending Community Itineraries</span>
            </h2>
            <Link to="/community" className="text-xs font-heading font-bold text-primary hover:underline">
              Join Feed
            </Link>
          </div>

          <div className="space-y-3">
            {communityPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="neo-brutal-card p-4 bg-surface-container-low space-y-2">
                <div className="flex items-center gap-2">
                  <img src={post.authorAvatar} alt={post.authorName} className="w-6 h-6 rounded-full border border-on-surface" />
                  <span className="text-xs font-bold text-on-surface">{post.authorName}</span>
                  <span className="text-[10px] text-on-surface-variant">• {post.createdAt}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-on-surface">
                  {post.title}
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-1">
                  {post.description}
                </p>
                <div className="flex justify-between items-center pt-2 text-xs font-bold">
                  <span className="text-secondary">{post.destination} ({post.durationDays} Days)</span>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span>👍 {post.upvotes}</span>
                    <span>🔖 {post.bookmarksCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

const GlobeIllustration: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-on-surface">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="6"/>
    <ellipse cx="100" cy="100" rx="80" ry="35" stroke="currentColor" strokeWidth="4"/>
    <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="4"/>
    <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="4"/>
  </svg>
);
