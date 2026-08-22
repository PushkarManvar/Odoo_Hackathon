import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  Wand2, 
  Calendar,
  Eye
} from 'lucide-react';

export const ItineraryBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, itineraries, addItineraryItem, deleteItineraryItem, toggleItineraryStatus, activities } = useApp();
  
  const trip = trips.find(t => t.id === id) || trips[0];
  const items = itineraries[trip.id] || [];

  const [activeDay, setActiveDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Culture');
  const [newTimeSlot, setNewTimeSlot] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newLocation, setNewLocation] = useState(trip.destination);
  const [newCost, setNewCost] = useState(25);
  const [newNotes, setNewNotes] = useState('');

  const dayItems = items.filter(i => i.dayNumber === activeDay);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addItineraryItem(trip.id, {
      dayNumber: activeDay,
      timeSlot: newTimeSlot,
      time: newTime,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      cost: Number(newCost),
      notes: newNotes
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleQuickAddRecommendation = (act: typeof activities[0]) => {
    addItineraryItem(trip.id, {
      dayNumber: activeDay,
      timeSlot: 'Afternoon',
      time: '02:00 PM',
      title: act.title,
      category: act.category,
      location: act.location,
      cost: act.price,
      notes: act.description
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/trips" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Trips</span>
            </Link>
            <span className="text-xs text-on-surface-variant">•</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full">
              Itinerary Builder Mode
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface">{trip.title}</h1>
          <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{trip.destination}, {trip.country} ({trip.daysCount} Days)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/trips/${trip.id}`} className="neo-brutal-btn-white px-4 py-2 text-xs flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>Preview Itinerary</span>
          </Link>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="neo-brutal-btn-primary px-4 py-2 text-xs flex items-center gap-2 shadow-brutal"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Budget Summary Bar */}
      <div className="neo-brutal-card p-4 bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-secondary text-white border-2 border-on-surface rounded-lg shadow-brutal-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-heading font-bold text-on-surface-variant">Allocated Budget</span>
            <p className="font-heading font-extrabold text-xl text-on-surface">
              ${trip.spentBudget} <span className="text-xs text-on-surface-variant font-normal">/ ${trip.budget} USD</span>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span>Budget Spent</span>
            <span className="text-primary">{Math.round((trip.spentBudget / trip.budget) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-surface border-2 border-on-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min(100, (trip.spentBudget / trip.budget) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Days Timeline & Smart Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Days & Timeline Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Array.from({ length: trip.daysCount || 5 }).map((_, idx) => {
              const dayNum = idx + 1;
              const isActive = activeDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`px-4 py-2 text-xs font-heading font-bold rounded-md border-2 whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-primary text-white border-on-surface shadow-brutal-sm' 
                      : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Day {dayNum}
                </button>
              );
            })}
          </div>

          {/* Timeline Cards */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Day {activeDay} Schedule ({dayItems.length} Activities)</span>
              </h3>
            </div>

            {dayItems.length === 0 ? (
              <div className="neo-brutal-card p-8 text-center bg-surface-container-low space-y-3">
                <Sparkles className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-heading font-bold text-sm text-on-surface">No activities planned for Day {activeDay}</h4>
                <p className="text-xs text-on-surface-variant">Add activities manually or click recommendations on the right.</p>
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="neo-brutal-btn-primary px-4 py-1.5 text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Activity</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`neo-brutal-card p-4 bg-surface-container-lowest flex items-start justify-between gap-4 transition-all ${
                      item.status === 'completed' ? 'opacity-70 bg-surface-container-high' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleItineraryStatus(trip.id, item.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 border-on-surface flex items-center justify-center transition-colors ${
                          item.status === 'completed' ? 'bg-secondary text-white' : 'bg-surface'
                        }`}
                      >
                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>{item.time} ({item.timeSlot})</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-surface-container-high border border-on-surface rounded-full">{item.category}</span>
                        </div>
                        <h4 className={`font-heading font-bold text-base text-on-surface mt-1 ${item.status === 'completed' ? 'line-through' : ''}`}>
                          {item.title}
                        </h4>
                        {item.notes && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.notes}</p>}
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {item.location}
                          </span>
                          <span className="font-bold text-primary">${item.cost} USD</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteItineraryItem(trip.id, item.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-colors"
                      title="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* AI Recommendations Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="neo-brutal-card p-4 bg-surface-container-low space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-on-surface pb-2">
              <Wand2 className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm text-on-surface">AI Smart Recommendations</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Handpicked eco activities tailored for {trip.destination}:
            </p>

            <div className="space-y-3">
              {activities.slice(0, 3).map(act => (
                <div key={act.id} className="neo-brutal-card p-3 bg-surface-container-lowest space-y-2">
                  <div className="flex gap-2 items-center">
                    <img src={act.image} alt={act.title} className="w-12 h-12 object-cover rounded border border-on-surface" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-heading font-bold text-xs text-on-surface truncate">{act.title}</h5>
                      <span className="text-[10px] text-primary font-bold">${act.price} • {act.duration}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleQuickAddRecommendation(act)}
                    className="w-full neo-brutal-btn-primary py-1 text-[11px] flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Day {activeDay}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neo-brutal-card p-6 bg-surface-container-low max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-2">
              <h3 className="font-heading font-extrabold text-lg text-on-surface">Add Activity to Day {activeDay}</h3>
              <button onClick={() => setShowAddModal(false)} className="font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Activity Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Zen Meditation Class" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  required
                  className="w-full px-3 py-1.5 text-xs neo-brutal-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Time Slot</label>
                  <select 
                    value={newTimeSlot} 
                    onChange={(e) => setNewTimeSlot(e.target.value as any)} 
                    className="w-full px-2 py-1.5 text-xs neo-brutal-input"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Time</label>
                  <input 
                    type="text" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                    className="w-full px-2 py-1.5 text-xs neo-brutal-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Location</label>
                  <input 
                    type="text" 
                    value={newLocation} 
                    onChange={(e) => setNewLocation(e.target.value)} 
                    className="w-full px-2 py-1.5 text-xs neo-brutal-input" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Cost ($)</label>
                  <input 
                    type="number" 
                    value={newCost} 
                    onChange={(e) => setNewCost(Number(e.target.value))} 
                    className="w-full px-2 py-1.5 text-xs neo-brutal-input" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Notes / Tips</label>
                <textarea 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)} 
                  rows={2} 
                  className="w-full px-3 py-1.5 text-xs neo-brutal-input"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 neo-brutal-btn-primary py-2 text-xs">
                  Save Activity
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="neo-brutal-btn-white px-4 py-2 text-xs">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
