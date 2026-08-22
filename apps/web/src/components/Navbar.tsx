import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  PlusCircle, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Leaf, 
  Search 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, notificationsCount, clearNotifications, searchQuery, setSearchQuery, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Plan Trip', path: '/trips/new' },
    { name: 'Explore', path: '/explore' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Community', path: '/community' },
    { name: 'My Dashboard', path: '/admin' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 bg-background border-b-4 border-on-surface shadow-brutal z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary text-white border-2 border-on-surface shadow-brutal-sm rounded-lg flex items-center justify-center font-heading font-extrabold text-xl group-hover:rotate-6 transition-transform">
            GT
          </div>
          <div>
            <span className="font-heading font-bold text-2xl text-primary tracking-tight">Globe Trotter</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded-full">
              Mindful Travel
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search destinations, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm neo-brutal-input font-body"
          />
          <Search className="w-4 h-4 absolute left-3 text-on-surface-variant" />
        </form>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-heading font-bold rounded-md transition-all ${
                  isActive
                    ? 'text-primary bg-primary-container/20 border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Eco Points Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container border-2 border-on-surface shadow-brutal-sm rounded-full text-xs font-heading font-bold">
            <Leaf className="w-3.5 h-3.5 text-secondary" />
            <span>{user.ecoScore} pts</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-surface-container-high border-2 border-transparent rounded-full relative transition-all active:translate-y-0.5"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-on-surface" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-on-surface">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 neo-brutal-card-static bg-surface p-4 z-50">
                <div className="flex justify-between items-center pb-2 border-b-2 border-on-surface mb-3">
                  <h4 className="font-heading font-bold text-sm text-on-surface">Notifications</h4>
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-2 bg-surface-container rounded border border-on-surface">
                    <p className="font-semibold">Kyoto trip starts in 5 days!</p>
                    <span className="text-on-surface-variant text-[10px]">2 hours ago</span>
                  </div>
                  <div className="p-2 bg-surface-container rounded border border-on-surface">
                    <p className="font-semibold">Elena upvoted your Alpine Trek itinerary.</p>
                    <span className="text-on-surface-variant text-[10px]">Yesterday</span>
                  </div>
                  <div className="p-2 bg-surface-container rounded border border-on-surface">
                    <p className="font-semibold">New zero-carbon activity added in Kyoto.</p>
                    <span className="text-on-surface-variant text-[10px]">3 days ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="p-1 border-2 border-on-surface rounded-full hover:shadow-brutal-sm transition-all overflow-hidden"
            title="User Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>

          {isAuthenticated && (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold rounded-md border-2 border-on-surface bg-surface text-on-surface hover:bg-error hover:text-white transition-all"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-high rounded-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-high border-t-2 border-on-surface p-4 space-y-3 shadow-brutal">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm neo-brutal-input"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md font-heading font-bold border-2 ${
                location.pathname === link.path
                  ? 'bg-primary text-white border-on-surface shadow-brutal-sm'
                  : 'bg-surface text-on-surface border-on-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-on-surface flex justify-between items-center text-xs font-bold">
            <Link to="/login" className="text-primary hover:underline">Sign In / Sign Up</Link>
            <span className="text-secondary font-bold">Eco Points: {user.ecoScore}</span>
          </div>
        </div>
      )}
    </header>
  );
};
