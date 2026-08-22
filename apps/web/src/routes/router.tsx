import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ItineraryPage } from "../pages/itinerary/ItineraryPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ItineraryBuilderPage } from "../pages/itinerary/ItineraryBuilderPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { NewTripPage } from "../pages/trips/NewTripPage";

function Placeholder({ title }: { title: string }) {
  return <div>{title}</div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/public/:slug"
        element={<Placeholder title="Public trip" />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
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
            <NewTripPage />
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
        path="/trips/:tripId/build"
        element={
          <ProtectedRoute>
            <ItineraryBuilderPage />
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
