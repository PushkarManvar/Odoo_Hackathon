import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Globe, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-surface-container-highest border-t-4 border-on-surface pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white border-2 border-on-surface rounded flex items-center justify-center font-heading font-bold text-lg">
              GT
            </div>
            <span className="font-heading font-extrabold text-xl text-primary">Globe Trotter</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Empowering travelers to build, share, and experience authentic, sustainable travel itineraries worldwide.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
            <Leaf className="w-4 h-4" />
            <span>Certified 100% Carbon Neutral Travel Platform</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-sm text-on-surface mb-3 border-b-2 border-on-surface pb-1 w-max">
            Explore Features
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/trips/new" className="hover:text-primary hover:underline">AI Trip Planner</Link></li>
            <li><Link to="/explore" className="hover:text-primary hover:underline">Sustainable Activities</Link></li>
            <li><Link to="/calendar" className="hover:text-primary hover:underline">Travel Calendar</Link></li>
            <li><Link to="/community" className="hover:text-primary hover:underline">Community Itineraries</Link></li>
          </ul>
        </div>

        {/* Account & Resources */}
        <div>
          <h4 className="font-heading font-bold text-sm text-on-surface mb-3 border-b-2 border-on-surface pb-1 w-max">
            Resources & Portal
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/profile" className="hover:text-primary hover:underline">Traveler Profile & Badges</Link></li>
            <li><Link to="/admin" className="hover:text-primary hover:underline">Admin Moderation Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-primary hover:underline">Login / Register</Link></li>
            <li><a href="#" className="hover:text-primary hover:underline">Eco Travel Guidelines</a></li>
          </ul>
        </div>

        {/* Newsletter / Eco pledge */}
        <div className="space-y-3 neo-brutal-card p-4 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="font-heading font-bold text-xs text-on-surface">Join Mindful Explorers</h4>
          </div>
          <p className="text-[11px] text-on-surface-variant">Get weekly handpicked zero-waste itineraries and hidden local gems.</p>
          <div className="flex gap-1">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full text-xs px-2 py-1 neo-brutal-input"
            />
            <button className="neo-brutal-btn-primary px-3 py-1 text-xs">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t-2 border-on-surface/30 flex flex-col sm:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
        <p>© 2026 Globe Trotter Inc. Designed with Serene Journeys Neo-Brutalism style.</p>
        <div className="flex items-center gap-4 font-semibold">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Sustainability Report</a>
        </div>
      </div>
    </footer>
  );
};
