import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Search, 
  Grid, 
  List, 
  Trash2, 
  Edit3, 
  Share2, 
  Leaf, 
  DollarSign, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const MyTrips: React.FC = () => {
  const { trips, deleteTrip } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) || 
                          trip.destination.toLowerCase().includes(search.toLowerCase()) ||
                          trip.country.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface flex items-center gap-3">
            <span>My Travel Journeys</span>
            <span className="text-xs px-2.5 py-0.5 bg-primary text-white border border-on-surface rounded-full">
              {trips.length} Total
            </span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your past expeditions, active itineraries, and draft trip concepts.
          </p>
        </div>

        <Link to="/trips/new" className="neo-brutal-btn-primary px-4 py-2.5 flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Control Bar: Filters, Search, View Mode */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 neo-brutal-card-static">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['all', 'upcoming', 'draft', 'completed', 'shared'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-heading font-bold rounded-md border-2 capitalize transition-all ${
                filterStatus === status
                  ? 'bg-primary text-white border-on-surface shadow-brutal-sm'
                  : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-60">
            <input 
              type="text"
              placeholder="Filter by city or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs neo-brutal-input"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          </div>

          <div className="flex border-2 border-on-surface rounded-md overflow-hidden bg-surface shadow-brutal-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-high'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-high'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Trips Grid / List View */}
      {filteredTrips.length === 0 ? (
        <div className="neo-brutal-card p-12 text-center bg-surface-container-low space-y-4">
          <Sparkles className="w-10 h-10 text-primary mx-auto" />
          <h3 className="font-heading font-bold text-lg text-on-surface">No trips match your criteria</h3>
          <p className="text-xs text-on-surface-variant">Try adjusting your filters or start a fresh trip plan.</p>
          <Link to="/trips/new" className="inline-block neo-brutal-btn-primary px-4 py-2 text-xs">
            Plan New Trip
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="neo-brutal-card bg-surface-container-lowest overflow-hidden flex flex-col justify-between">
              <div>
                {/* Card Image Header */}
                <div className="relative h-48">
                  <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover border-b-4 border-on-surface" />
                  <div className={`absolute top-3 left-3 px-2.5 py-0.5 text-xs font-heading font-bold border-2 border-on-surface shadow-brutal-sm rounded-full capitalize ${
                    trip.status === 'upcoming' ? 'bg-primary text-white' :
                    trip.status === 'completed' ? 'bg-secondary text-white' :
                    trip.status === 'draft' ? 'bg-surface-container-high text-on-surface' :
                    'bg-tertiary text-white'
                  }`}>
                    {trip.status}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-surface text-on-surface border-2 border-on-surface text-[11px] font-bold rounded-full flex items-center gap-1 shadow-brutal-sm">
                    <Leaf className="w-3 h-3 text-secondary" />
                    <span>{trip.ecoPoints} pts</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{trip.destination}, {trip.country}</span>
                    <span>•</span>
                    <span>{trip.daysCount} Days</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-on-surface line-clamp-1">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  {/* Budget Progress */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Spent: ${trip.spentBudget}</span>
                      <span>Target: ${trip.budget}</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high border-2 border-on-surface rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (trip.spentBudget / trip.budget) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t-2 border-on-surface bg-surface-container-low flex justify-between items-center gap-2">
                <Link to={`/trips/${trip.id}`} className="neo-brutal-btn-primary px-3 py-1.5 text-xs flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1">
                  <Link 
                    to={`/trips/${trip.id}/builder`} 
                    className="p-1.5 neo-brutal-btn-white text-xs" 
                    title="Edit Builder"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                  <button 
                    onClick={() => deleteTrip(trip.id)}
                    className="p-1.5 bg-error-container text-on-error-container border-2 border-on-surface rounded-md hover:bg-error hover:text-white transition-all shadow-brutal-sm" 
                    title="Delete Trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="neo-brutal-card p-4 bg-surface-container-lowest flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <img src={trip.coverImage} alt={trip.title} className="w-24 h-20 object-cover rounded-lg border-2 border-on-surface" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{trip.destination}, {trip.country}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-surface-container-high border border-on-surface rounded-full capitalize">{trip.status}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-on-surface">{trip.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-1">
                    <span>{trip.startDate} - {trip.endDate}</span>
                    <span>Budget: ${trip.spentBudget} / ${trip.budget}</span>
                    <span className="text-secondary font-bold">🍃 {trip.ecoPoints} pts</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <Link to={`/trips/${trip.id}`} className="neo-brutal-btn-primary px-3 py-1.5 text-xs">
                  View Itinerary
                </Link>
                <Link to={`/trips/${trip.id}/builder`} className="neo-brutal-btn-white px-3 py-1.5 text-xs">
                  Edit Builder
                </Link>
                <button 
                  onClick={() => deleteTrip(trip.id)}
                  className="p-2 bg-error-container text-on-error-container border-2 border-on-surface rounded-md hover:bg-error hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
