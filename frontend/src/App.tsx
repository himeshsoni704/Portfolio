import { Component, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RockyProvider from './components/RockyProvider';
import RockyLauncher from './components/RockyLauncher';
import RockyChat from './components/RockyChat';
import Home from './pages/Home';
import ProjectPage from './pages/Project';
import { initLenis, scrollTopImmediate } from './lib/lenis';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div style={{ padding: 80, color: '#94a3b8', fontFamily: 'Outfit, sans-serif' }}>
          Something floated out of orbit. Refresh to try again.
        </div>
      );
    return this.props.children;
  }
}

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollTopImmediate();
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <RockyLauncher />
      <RockyChat />
    </>
  );
}

export default function App() {
  useEffect(() => {
    initLenis();
  }, []);
  return (
    <ErrorBoundary>
      <RockyProvider>
        <BrowserRouter>
          <Shell />
          <Toaster position="bottom-center" theme="dark" />
        </BrowserRouter>
      </RockyProvider>
    </ErrorBoundary>
  );
}
