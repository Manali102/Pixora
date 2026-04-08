
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { PricingPage } from './pages/PricingPage';
import { CreatePinPage } from './pages/CreatePinPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import { usePinStore } from './store/usePinStore';
import { PinModal } from './components/ui/PinModal';

const App: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const showNavbar = isAuthenticated && !['/login', '/signup'].includes(location.pathname);
  const fetchPins = usePinStore(s => s.fetchPins);
  const checkStorageReset = useAuthStore(s => s.checkStorageReset);

  useEffect(() => {
    fetchPins();
    checkStorageReset();
  }, [fetchPins, checkStorageReset]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {showNavbar && <Navbar />}

      <main className={`${showNavbar ? 'pt-24 pb-20 md:pb-12 px-4 sm:px-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ProtectedRoute>
              <HomePage />
            </ProtectedRoute>} />
            <Route path="/login" element={
              <ErrorBoundary>
                <LoginPage />
              </ErrorBoundary>
            } />
            <Route path="/signup" element={
              <ErrorBoundary>
                <SignupPage />
              </ErrorBoundary>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            } />

            <Route path="/pricing" element={
              <ProtectedRoute excludeAdmin>
                <PricingPage />
              </ProtectedRoute>
            } />

            <Route path="/create" element={
              <ProtectedRoute>
                <CreatePinPage />
              </ProtectedRoute>
            } />

            {/* 404 catch-all protected to redirect unauth to login */}
            <Route path="*" element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {showNavbar && <BottomNav />}
      <PinModal />

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default App;
