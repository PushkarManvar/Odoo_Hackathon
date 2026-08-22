import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ItineraryPage } from "../pages/itinerary/ItineraryPage";

function Placeholder({ title }: { title: string }) {
  return <div>{title}</div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/signup" element={<Placeholder title="Signup" />} />
      <Route
        path="/public/:slug"
        element={<Placeholder title="Public trip" />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Placeholder title="Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Placeholder title="My Trips" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/new"
        element={
          <ProtectedRoute>
            <Placeholder title="New Trip" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId"
        element={
          <ProtectedRoute>
            <Placeholder title="Trip detail" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/edit"
        element={
          <ProtectedRoute>
            <Placeholder title="Edit trip" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/itinerary"
        element={
          <ProtectedRoute>
            <ItineraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/budget"
        element={
          <ProtectedRoute>
            <Placeholder title="Budget" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/calendar"
        element={
          <ProtectedRoute>
            <Placeholder title="Calendar" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Placeholder title="Profile" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}
