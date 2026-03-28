import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";

// Authentication & Components
import { logout } from "./slices/authSlice"; 
import ChangePassword from "./components/ChangePassword";

// Core Pages
import Login from "./pages/login";
import Homepage from "./pages/Homepage";
import BranchDashboard from "./pages/BranchDashboard";
import DivisionDashboard from "./pages/DivisionDashboard";
import CircleDashboard from "./pages/CircleDashboard";

// Profile & Admin Pages
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import Add_branch from "./pages/Add_branch";
import RegisteredList from "./pages/RegisteredList";

// Form & Reporting Pages
import BranchESGForm from "./pages/BranchESGForm";
import DivisionESGForm from "./pages/DivisionESGForm";
import DivisionReport from "./pages/DivisionReport";
import BranchReport from "./pages/BRSRReport";

// AI & Analysis Pages
import BranchForecast from "./pages/BranchForecast";
import BranchRecommendations from "./pages/BranchRecommendations";

// Support & Info Pages
import Guidelines from "./pages/Guidelines";
import Deadlines from "./pages/Deadlines";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";

// Protected Route wrapper component
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If not authenticated, redirect to login
  return token && isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Optional: Logic for session checks can go here
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />

        {/* --- Private Dashboards --- */}
        <Route
          path="/branch-dashboard/*"
          element={<PrivateRoute><BranchDashboard /></PrivateRoute>}
        />
        <Route
          path="/division-dashboard/*"
          element={<PrivateRoute><DivisionDashboard /></PrivateRoute>}
        />
        <Route
          path="/circle-dashboard/*"
          element={<PrivateRoute><CircleDashboard /></PrivateRoute>}
        />

        {/* --- ESG Forms & Data Entry --- */}
        <Route
          path="/branch-esg-form"
          element={<PrivateRoute><BranchESGForm /></PrivateRoute>}
        />
        <Route
          path="/division-esg-form"
          element={<PrivateRoute><DivisionESGForm /></PrivateRoute>}
        />

        {/* --- Reporting & Analysis --- */}
        <Route
          path="/division-report"
          element={<PrivateRoute><DivisionReport /></PrivateRoute>}
        />
        <Route
          path="/brsr-report"
          element={<PrivateRoute><BranchReport /></PrivateRoute>}
        />
        <Route
          path="/branch-forecast"
          element={<PrivateRoute><BranchForecast /></PrivateRoute>}
        />
        <Route
          path="/branch-recommendations"
          element={<PrivateRoute><BranchRecommendations /></PrivateRoute>}
        />

        {/* --- Support & Guidelines --- */}
        <Route
          path="/guidelines"
          element={<PrivateRoute><Guidelines /></PrivateRoute>}
        />
        <Route
          path="/deadlines"
          element={<PrivateRoute><Deadlines /></PrivateRoute>}
        />
        <Route
          path="/support"
          element={<PrivateRoute><Support /></PrivateRoute>}
        />
        <Route
          path="/faq"
          element={<PrivateRoute><FAQ /></PrivateRoute>}
        />

        {/* --- User Profile & Admin --- */}
        <Route
          path="/view/profile"
          element={<PrivateRoute><ProfileView /></PrivateRoute>}
        />
        <Route
          path="/edit/profile"
          element={<PrivateRoute><ProfileEdit /></PrivateRoute>}
        />
        <Route
          path="/change-password"
          element={<PrivateRoute><ChangePassword /></PrivateRoute>}
        />
        <Route 
          path="/registered-list" 
          element={<PrivateRoute><RegisteredList /></PrivateRoute>}
        />
        <Route 
          path="/add-branch" 
          element={<PrivateRoute><Add_branch /></PrivateRoute>}
        />

        {/* --- Wildcard Route --- */}
        <Route path="*" element={<Navigate to="/Homepage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;