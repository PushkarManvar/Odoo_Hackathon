import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Leaf, 
  Plus, 
  Check, 
  Compass, 
  DollarSign 
} from 'lucide-react';

export const ActivitySearch: React.FC = () => {
  const { activities, trips, addItineraryItem } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const categories = ['All', 'Culture', 'Nature', 'Adventure', 'Food', 'Shopping'];

  const filteredActivities = activities.filter(act => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch = act.title.toLowerCase().includes(search.toLowerCase()) || 
                          act.location.toLowerCase().includes(search.toLowerCase()) ||
                          act.city.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = act.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleConfirmAdd = () => {
    if (!selectedActivity || !selectedTripId) return;

    addItineraryItem(selectedTripId, {
      dayNumber: selectedDay,
      timeSlot: 'Afternoon',
      time: '02:30 PM',
      title: selectedActivity.title,
      category: selectedActivity.category,
      location: `${selectedActivity.location}, ${selectedActivity.city}`,
      cost: selectedActivity.price,
      notes: selectedActivity.description
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedActivity(null);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b-4 border-on-surface pb-6 space-y-2">
        <h1 className="font-heading font-extrabold text-3xl text-on-surface flex items-center gap-3">
          <Compass className="w-8 h-8 text-primary" />
          <span>Sustainable Activity Discovery</span>
        </h1>
        <p className="text-xs text-on-surface-variant">
          Explore eco-certified workshops, nature trails, and authentic culinary experiences around the world.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="neo-brutal-card p-4 bg-surface-container-low space-y-4">
        
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search experiences, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs neo-brutal-input"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-on-surface whitespace-nowrap">Max Price: ${maxPrice}</span>
            <input 
              type="range" 
              min="10" 
              max="200" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-40 accent-primary"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-on-surface/20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-heading font-bold rounded-full border-2 transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-on-surface shadow-brutal-sm'
                  : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map(act => (
          <div key={act.id} className="neo-brutal-card bg-surface-container-lowest overflow-hidden flex flex-col justify-between">
            <div>
              {/* Image & Badges */}
              <div className="relative h-48">
                <img src={act.image} alt={act.title} className="w-full h-full object-cover border-b-4 border-on-surface" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-surface text-on-surface border-2 border-on-surface text-xs font-bold rounded-full shadow-brutal-sm">
                  {act.category}
                </span>
                {act.ecoBadge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-secondary text-white border-2 border-on-surface text-[10px] font-bold rounded-full flex items-center gap-1 shadow-brutal-sm">
                    <Leaf className="w-3 h-3" />
                    {act.ecoBadge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {act.location}, {act.city}
                  </span>
                  <span className="flex items-center gap-1 text-on-surface">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {act.rating} ({act.reviewsCount})
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-lg text-on-surface line-clamp-1">
                  {act.title}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {act.description}
                </p>

                <div className="flex justify-between items-center pt-2 text-xs font-bold">
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {act.duration}
                  </span>
                  <span className="font-heading font-extrabold text-base text-primary">
                    ${act.price} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t-2 border-on-surface bg-surface-container-low">
              <button 
                onClick={() => setSelectedActivity(act)}
                className="w-full neo-brutal-btn-primary py-2 text-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Trip Itinerary</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add to Trip Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neo-brutal-card p-6 bg-surface-container-low max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-2">
              <h3 className="font-heading font-bold text-base text-on-surface">Add Activity to Trip</h3>
              <button onClick={() => setSelectedActivity(null)} className="font-bold text-sm">✕</button>
            </div>

            <div className="flex gap-3 items-center bg-surface p-3 border-2 border-on-surface rounded-lg">
              <img src={selectedActivity.image} alt={selectedActivity.title} className="w-14 h-14 object-cover rounded border border-on-surface" />
              <div>
                <h4 className="font-heading font-bold text-xs text-on-surface">{selectedActivity.title}</h4>
                <p className="text-[11px] text-primary font-bold">${selectedActivity.price} • {selectedActivity.duration}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold">Select Target Trip</label>
                <select 
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full px-3 py-2 neo-brutal-input"
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">Select Day</label>
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full px-3 py-2 neo-brutal-input"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleConfirmAdd}
              disabled={addedSuccess}
              className={`w-full py-2.5 text-xs flex items-center justify-center gap-2 ${
                addedSuccess ? 'neo-brutal-btn-secondary' : 'neo-brutal-btn-primary'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added Successfully!</span>
                </>
              ) : (
                <span>Confirm & Add Activity</span>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
