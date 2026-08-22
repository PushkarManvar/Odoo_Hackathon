import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Compass, 
  Leaf, 
  Route, 
  Calendar, 
  TrendingUp, 
  Award 
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, trips } = useApp();

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);
  const totalSpent = trips.reduce((sum, t) => sum + t.spentBudget, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b-4 border-on-surface pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-secondary text-white border border-on-surface text-xs font-bold rounded-full">
              My Travel Dashboard
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            <span>Welcome, {user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">{user.handle} · {user.email}</p>
        </div>
        <Link to="/trips/new" className="neo-brutal-btn-primary px-4 py-2 text-sm flex items-center gap-2">
          <Compass className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Personal Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant">Trips Planned</span>
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">{user.tripsPlanned}</p>
          <span className="text-[11px] text-secondary font-bold">{upcomingTrips.length} upcoming now</span>
        </div>

        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant">Countries Visited</span>
            <MapPin className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">{user.countriesVisited}</p>
          <span className="text-[11px] text-secondary font-bold">{completedTrips.length} trips completed</span>
        </div>

        <div className="neo-brutal-card p-5 bg-surface-container-lowest">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant">Eco Score</span>
            <Leaf className="w-4 h-4 text-tertiary" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-on-surface">{user.ecoScore}<span className="text-base text-on-surface-variant">/100</span></p>
          <span className="text-[11px] text-tertiary font-bold">Zero-carbon explorer</span>
        </div>

        <div className="neo-brutal-card p-5 bg-tertiary-container/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant">Distance Traveled</span>
            <Route className="w-4 h-4 text-tertiary" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-tertiary">{user.totalDistanceKm.toLocaleString()} km</p>
          <span className="text-[11px] text-tertiary font-bold">across {user.countriesVisited} countries</span>
        </div>
      </div>

      {/* My Trips Section */}
      <div className="neo-brutal-card p-6 bg-surface-container-low space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-on-surface pb-4">
          <h3 className="font-heading font-extrabold text-lg text-on-surface">My Trips</h3>
          <Link to="/trips" className="text-xs font-heading font-bold text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-on-surface font-heading font-bold text-on-surface">
                <th className="py-2 px-3">Trip</th>
                <th className="py-2 px-3">Destination</th>
                <th className="py-2 px-3">Dates</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Budget</th>
                <th className="py-2 px-3">Eco Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/20">
              {trips.map(trip => (
                <tr key={trip.id} className="hover:bg-surface-container-high transition-colors">
                  <td className="py-3 px-3">
                    <Link to={`/trips/${trip.id}`} className="block font-bold text-on-surface hover:text-primary">
                      {trip.title}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className="block font-semibold text-on-surface">{trip.destination}</span>
                    <span className="block text-[11px] text-on-surface-variant">{trip.country}</span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{trip.startDate} → {trip.endDate}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      trip.status === 'upcoming' ? 'bg-primary-container text-on-primary-container border-on-surface' :
                      trip.status === 'completed' ? 'bg-secondary text-white border-on-surface' :
                      'bg-amber-400 text-on-surface border-on-surface'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">${trip.spentBudget} / ${trip.budget}</td>
                  <td className="py-3 px-3 font-bold text-secondary flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" /> {trip.ecoPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="neo-brutal-card p-4 bg-surface-container-low flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary shrink-0" />
          <div>
            <p className="text-xs font-bold text-on-surface-variant">Total Trip Days</p>
            <p className="font-heading font-extrabold text-lg text-on-surface">
              {trips.reduce((sum, t) => sum + t.daysCount, 0)}
            </p>
          </div>
        </div>
        <div className="neo-brutal-card p-4 bg-surface-container-low flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-on-surface-variant">Spent / Budget</p>
            <p className="font-heading font-extrabold text-lg text-on-surface">
              ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="neo-brutal-card p-4 bg-surface-container-low flex items-center gap-3">
          <Award className="w-6 h-6 text-tertiary shrink-0" />
          <div>
            <p className="text-xs font-bold text-on-surface-variant">Badges Earned</p>
            <p className="font-heading font-extrabold text-lg text-on-surface">{user.badges.length}</p>
          </div>
        </div>
      </div>

    </div>
  );
};