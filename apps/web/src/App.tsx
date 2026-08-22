import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyTrips } from './pages/MyTrips';
import { PlanNewTrip } from './pages/PlanNewTrip';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { ItineraryView } from './pages/ItineraryView';
import { ActivitySearch } from './pages/ActivitySearch';
import { CalendarView } from './pages/CalendarView';
import { Community } from './pages/Community';
import { UserProfile } from './pages/UserProfile';
import { UserDashboard } from './pages/UserDashboard';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
            <Route path="/trips/new" element={<ProtectedRoute><PlanNewTrip /></ProtectedRoute>} />
            <Route path="/trips/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
            <Route path="/trips/:id/builder" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
