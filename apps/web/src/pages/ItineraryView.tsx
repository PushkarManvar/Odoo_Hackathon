import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  MapPin, 
  Calendar, 
  Leaf, 
  DollarSign, 
  CheckSquare, 
  Square, 
  Edit3, 
  Map, 
  Clock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ItineraryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, itineraries, toggleItineraryStatus } = useApp();

  const trip = trips.find(t => t.id === id) || trips[0];
  const items = itineraries[trip.id] || [];

  const [activeDay, setActiveDay] = useState(1);
  const [showMapView, setShowMapView] = useState(false);
  const [packingList, setPackingList] = useState([
    { id: 'p1', item: 'Reusable Stainless Water Bottle', checked: true },
    { id: 'p2', item: 'JR Rail Pass & Pocket WiFi', checked: true },
    { id: 'p3', item: 'Eco Temple Pass / Entrance Voucher', checked: false },
    { id: 'p4', item: 'Walking Shoes & Rain Shell', checked: false },
    { id: 'p5', item: 'Universal Power Adapter', checked: true }
  ]);

  const togglePackingItem = (pId: string) => {
    setPackingList(prev => prev.map(p => p.id === pId ? { ...p, checked: !p.checked } : p));
  };

  const dayItems = items.filter(i => i.dayNumber === activeDay);

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="neo-brutal-card p-6 sm:p-8 bg-surface-container-low relative overflow-hidden space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <Link to="/trips" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Trips</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-primary text-white border border-on-surface text-xs font-bold rounded-full capitalize">
                {trip.status}
              </span>
              <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface text-xs font-bold rounded-full flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-secondary" />
                {trip.ecoPoints} Eco Points
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-2">{trip.title}</h1>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2 font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                {trip.destination}, {trip.country}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                {trip.startDate} - {trip.endDate} ({trip.daysCount} Days)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to={`/trips/${trip.id}/builder`} className="neo-brutal-btn-primary px-4 py-2 text-xs flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              <span>Edit Builder</span>
            </Link>
            <button 
              onClick={() => alert(`Share URL copied: https://globetrotter.io/trips/${trip.id}`)}
              className="neo-brutal-btn-white px-3 py-2 text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => alert("Itinerary PDF export generated!")}
              className="neo-brutal-btn-white px-3 py-2 text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* View Toggle Bar (Timeline vs Map View) */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-on-surface/20">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowMapView(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md border-2 ${
                !showMapView ? 'bg-primary text-white border-on-surface shadow-brutal-sm' : 'bg-surface text-on-surface border-on-surface'
              }`}
            >
              Timeline View
            </button>
            <button 
              onClick={() => setShowMapView(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md border-2 flex items-center gap-1 ${
                showMapView ? 'bg-primary text-white border-on-surface shadow-brutal-sm' : 'bg-surface text-on-surface border-on-surface'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          <span className="text-xs font-bold text-secondary">
            Spent: ${trip.spentBudget} / ${trip.budget}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {showMapView ? (
        /* Map View Component Mockup */
        <div className="neo-brutal-card p-6 bg-surface-container-low text-center space-y-4">
          <div className="relative w-full h-96 bg-surface-container-highest border-2 border-on-surface rounded-lg overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#9f402d_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-2 p-6 bg-surface border-2 border-on-surface shadow-brutal rounded-xl max-w-sm">
              <MapPin className="w-10 h-10 text-primary mx-auto animate-bounce" />
              <h4 className="font-heading font-extrabold text-base text-on-surface">Interactive Route Map</h4>
              <p className="text-xs text-on-surface-variant">
                Showing {dayItems.length} locations pin mapped across {trip.destination}.
              </p>
              <div className="pt-2 text-left space-y-1 text-xs">
                {dayItems.map(i => (
                  <div key={i.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-bold">{i.title}</span>
                    <span className="text-on-surface-variant">({i.location})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Day Selector & Activity List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Days Navbar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: trip.daysCount || 5 }).map((_, idx) => {
                const dayNum = idx + 1;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    className={`px-4 py-2 text-xs font-heading font-bold rounded-md border-2 whitespace-nowrap transition-all ${
                      activeDay === dayNum 
                        ? 'bg-primary text-white border-on-surface shadow-brutal-sm' 
                        : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    Day {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Activities Timeline */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-on-surface">Day {activeDay} Detailed Schedule</h3>

              {dayItems.length === 0 ? (
                <div className="neo-brutal-card p-8 text-center bg-surface-container-low space-y-2">
                  <p className="text-xs text-on-surface-variant">No items added to Day {activeDay} yet.</p>
                  <Link to={`/trips/${trip.id}/builder`} className="neo-brutal-btn-primary px-3 py-1.5 text-xs inline-block">
                    Open Builder to Add
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 relative border-l-4 border-primary pl-6 ml-3">
                  {dayItems.map(item => (
                    <div key={item.id} className="relative neo-brutal-card p-4 bg-surface-container-lowest">
                      <div className="absolute -left-9 top-4 w-5 h-5 bg-primary text-white border-2 border-on-surface rounded-full flex items-center justify-center text-[10px] font-bold">
                        •
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-primary">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time} ({item.timeSlot})</span>
                            <span className="text-on-surface-variant">•</span>
                            <span className="text-on-surface-variant font-semibold">{item.category}</span>
                          </div>
                          <h4 className="font-heading font-extrabold text-lg text-on-surface mt-1">
                            {item.title}
                          </h4>
                          {item.notes && <p className="text-xs text-on-surface-variant mt-1">{item.notes}</p>}
                        </div>

                        <span className="font-heading font-bold text-sm text-secondary bg-secondary-container px-2.5 py-1 border border-on-surface rounded-md">
                          ${item.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar: Packing List & Travel Documents */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Packing Checklist */}
            <div className="neo-brutal-card p-5 bg-surface-container-low space-y-4">
              <div className="flex justify-between items-center border-b-2 border-on-surface pb-2">
                <h4 className="font-heading font-bold text-sm text-on-surface flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <span>Packing Checklist</span>
                </h4>
                <span className="text-[11px] font-bold text-secondary">
                  {packingList.filter(p => p.checked).length} / {packingList.length}
                </span>
              </div>

              <div className="space-y-2">
                {packingList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => togglePackingItem(p.id)}
                    className="w-full text-left flex items-center gap-2 p-2 bg-surface border border-on-surface rounded hover:bg-surface-container-high text-xs font-medium"
                  >
                    {p.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                    )}
                    <span className={p.checked ? 'line-through text-on-surface-variant' : 'text-on-surface'}>
                      {p.item}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
