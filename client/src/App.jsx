import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import EditTrip from "./pages/EditTrip";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import PublicProfile from "./pages/PublicProfile";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AIPlanner from "./pages/AIPlanner";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

const AppContent = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
        <Route path="/ai-planner" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/edit-trip/:id" element={<ProtectedRoute><EditTrip /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
        <Route path="/trip/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;