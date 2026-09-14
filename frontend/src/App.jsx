import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import IdolDetailPage from './pages/IdolDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import EcoGuidePage from './pages/EcoGuidePage';
import NotFoundPage from './pages/NotFoundPage';

// Modals
import AddIdolModal from './components/AddIdolModal';

// Geolocation helper
import { getCurrentPosition } from './services/geo';

export function AppContent() {
  const [userLocation, setUserLocation] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auto-attempt geolocation on initial mount
  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = async () => {
    try {
      const pos = await getCurrentPosition();
      setUserLocation(pos);
      return pos;
    } catch (err) {
      console.log("GPS Location notice:", err.message);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-festive-softBg font-body">
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userLocation={userLocation}
        onRequestLocation={requestUserLocation}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAddModal={() => setIsAddModalOpen(true)}
                userLocation={userLocation}
                onRequestLocation={requestUserLocation}
              />
            }
          />
          
          <Route
            path="/map"
            element={
              <MapPage
                userLocation={userLocation}
                onRequestLocation={requestUserLocation}
              />
            }
          />

          <Route
            path="/idol/:id"
            element={<IdolDetailPage userLocation={userLocation} />}
          />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/eco-guide" element={<EcoGuidePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <AddIdolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Trigger optional refresh
        }}
      />

      <AuthPage
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
