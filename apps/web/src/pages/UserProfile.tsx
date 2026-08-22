import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Leaf, 
  Award, 
  MapPin, 
  Compass, 
  Globe, 
  Check, 
  Edit3, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useApp();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [preferences, setPreferences] = useState(user.preferences);

  const togglePref = (pref: string) => {
    setPreferences(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  return (
    <div className="space-y-8">
      
      {/* Profile Banner Card */}
      <div className="neo-brutal-card p-6 sm:p-8 bg-surface-container-low relative overflow-hidden space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-on-surface pb-6">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-on-surface shadow-brutal" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl text-on-surface">{user.name}</h1>
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-secondary" />
                  Eco Score {user.ecoScore}
                </span>
              </div>
              <p className="text-xs font-bold text-on-surface-variant">{user.handle} • {user.email}</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="neo-brutal-btn-white px-4 py-2 text-xs flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-primary" />
            <span>{isEditingBio ? 'Save Profile' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-sm text-on-surface">About Me</h3>
          {isEditingBio ? (
            <textarea 
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full p-3 text-xs neo-brutal-input"
              rows={3}
            />
          ) : (
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
              {bioText}
            </p>
          )}
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-brutal-card p-4 bg-surface-container-lowest text-center">
          <span className="block text-xs font-bold text-on-surface-variant">Trips Planned</span>
          <span className="font-heading font-extrabold text-2xl text-primary">{user.tripsPlanned}</span>
        </div>

        <div className="neo-brutal-card p-4 bg-surface-container-lowest text-center">
          <span className="block text-xs font-bold text-on-surface-variant">Countries Visited</span>
          <span className="font-heading font-extrabold text-2xl text-secondary">{user.countriesVisited}</span>
        </div>

        <div className="neo-brutal-card p-4 bg-surface-container-lowest text-center">
          <span className="block text-xs font-bold text-on-surface-variant">Distance Traveled</span>
          <span className="font-heading font-extrabold text-2xl text-tertiary">{(user.totalDistanceKm / 1000).toFixed(1)}k km</span>
        </div>

        <div className="neo-brutal-card p-4 bg-secondary-container/30 text-center">
          <span className="block text-xs font-bold text-on-surface-variant">Eco Ranking</span>
          <span className="font-heading font-extrabold text-2xl text-secondary">Top 5%</span>
        </div>
      </div>

      {/* Badges & Achievements Collection */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-on-surface flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span>Earned Sustainability Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="neo-brutal-card p-4 bg-surface-container-lowest space-y-2">
              <div className="w-10 h-10 bg-secondary text-white border-2 border-on-surface shadow-brutal-sm rounded-lg flex items-center justify-center font-heading font-bold text-lg">
                🍃
              </div>
              <h4 className="font-heading font-bold text-sm text-on-surface">{badge.name}</h4>
              <p className="text-[11px] text-on-surface-variant leading-normal">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="neo-brutal-card p-6 bg-surface-container-low space-y-4">
        <h3 className="font-heading font-bold text-base text-on-surface">Travel Preferences & Interests</h3>
        <div className="flex flex-wrap gap-2">
          {['Eco-Friendly', 'Culinary & Local Food', 'Heritage & History', 'Hiking & Trails', 'Budget conscious', 'Luxury', 'Rail Expeditions'].map(pref => {
            const active = preferences.includes(pref);
            return (
              <button
                key={pref}
                onClick={() => togglePref(pref)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all ${
                  active 
                    ? 'bg-secondary text-white border-on-surface shadow-brutal-sm' 
                    : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
                }`}
              >
                {pref} {active && '✓'}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
