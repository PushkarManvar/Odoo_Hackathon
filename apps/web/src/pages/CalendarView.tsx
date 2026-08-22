import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Plus, Filter } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { trips, itineraries } = useApp();
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Mock events overlay on calendar days
  const getEventsForDay = (day: number) => {
    if (day === 15) return [{ title: 'Kyoto Trip Begins', type: 'trip', color: 'bg-primary text-white' }];
    if (day === 16) return [{ title: 'Bamboo Grove Walk', type: 'activity', color: 'bg-secondary text-white' }, { title: 'Tea Ceremony', type: 'activity', color: 'bg-tertiary text-white' }];
    if (day === 17) return [{ title: 'Fushimi Inari Hike', type: 'activity', color: 'bg-secondary text-white' }];
    if (day === 20) return [{ title: 'Onsen Spa Relaxation', type: 'activity', color: 'bg-tertiary text-white' }];
    if (day === 22) return [{ title: 'Return Flight', type: 'trip', color: 'bg-primary text-white' }];
    return [];
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            <span>Travel Schedule & Calendar</span>
          </h1>
          <p className="text-xs text-on-surface-variant">Visual schedule of trip timelines, activity slots, and transit reminders.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border-2 border-on-surface rounded-md bg-surface overflow-hidden shadow-brutal-sm">
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-xs font-bold ${view === 'month' ? 'bg-primary text-white' : 'text-on-surface'}`}
            >
              Month View
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-xs font-bold ${view === 'week' ? 'bg-primary text-white' : 'text-on-surface'}`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigator */}
      <div className="neo-brutal-card p-4 bg-surface-container-low flex justify-between items-center">
        <button className="p-2 border-2 border-on-surface bg-surface rounded-md hover:bg-surface-container-high">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="font-heading font-extrabold text-xl text-on-surface">{currentMonth}</h3>

        <button className="p-2 border-2 border-on-surface bg-surface rounded-md hover:bg-surface-container-high">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid Header */}
      <div className="neo-brutal-card bg-surface-container-lowest overflow-hidden p-4 space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center font-heading font-extrabold text-xs text-on-surface-variant border-b-2 border-on-surface pb-2">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const events = getEventsForDay(day);
            const isToday = day === 15;
            return (
              <div 
                key={day}
                className={`min-h-[100px] p-2 border-2 border-on-surface rounded-lg bg-surface flex flex-col justify-between transition-all ${
                  isToday ? 'ring-2 ring-primary bg-primary-container/10' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-heading font-extrabold px-1.5 py-0.5 rounded ${
                    isToday ? 'bg-primary text-white' : 'text-on-surface'
                  }`}>
                    {day}
                  </span>
                  {events.length > 0 && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>

                <div className="space-y-1 my-1">
                  {events.map((ev, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[10px] font-bold p-1 border border-on-surface rounded truncate shadow-brutal-sm ${ev.color}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
