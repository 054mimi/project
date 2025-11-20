import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import Auth from './Auth';
import RegionSelector from './RegionSelector';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import GPSMap from './GPSMap';
import Charts from './Charts';
import ReGenInsight from './ReGenInsight';
import BlockchainLedger from './BlockchainLedger';
import AdminLogin from './AdminLogin';
import ChiefAdminDashboard from './ChiefAdminDashboard';
import SubAdminDashboard from './SubAdminDashboard';
import AdminCommunication from './AdminCommunication';
import ContactInfo from './ContactInfo';
import MostLikedImages from './MostLikedImages';
import UserSupport from './UserSupport';
import Notifications from './Notifications';

import {
  Satellite,
  LayoutDashboard,
  Image as ImageIcon,
  Map,
  BarChart3,
  Brain,
  Shield,
  LogOut,
  UserCircle,
  Menu,
  X,
  Heart,
  Phone,
  HelpCircle,
  Bell
} from 'lucide-react';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRegion, setSelectedRegion] = useState(1); // Default to Mombasa
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGuest, logout } = useAuth();
  const { admin, logoutAdmin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  // Determine if we are on an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (adminLoading) {
      return <div className="flex items-center justify-center min-h-screen text-lg">Loading Admin Panel...</div>;
    }
    if (!admin) {
      return <AdminLogin />;
    }
    return (
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/admin" element={admin.role === 'chief' ? <ChiefAdminDashboard /> : <SubAdminDashboard />} />
          <Route path="/admin/communication" element={<AdminCommunication />} />
          {/* Add other admin routes here if needed */}
        </Routes>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'GPS Map', icon: Map },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'images', label: 'Community Images', icon: ImageIcon },
    { id: 'most-liked', label: 'Most Liked', icon: Heart },
    { id: 'regen', label: 'ReGen Insight', icon: Brain },
    { id: 'blockchain', label: 'Blockchain', icon: Shield },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Satellite className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">ReGen Insight</h1>
                  <p className="text-xs text-green-100">Regenerative Intelligence Platform</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
              />
              <ImageUpload
                selectedRegion={selectedRegion}
                onUploadSuccess={() => {
                  if (activeTab !== 'images') setActiveTab('images');
                }}
              />
              <Notifications userId={user?.id || 'guest'} isAdmin={false} />
              {isGuest ? (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded flex items-center"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Sign In
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-white text-right">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-green-100">{user?.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-white/20 border border-white/30 text-white hover:bg-white/30 px-3 py-1 rounded flex items-center"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-green-500 pt-4">
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
              />
              <ImageUpload
                selectedRegion={selectedRegion}
                onUploadSuccess={() => {
                  if (activeTab !== 'images') setActiveTab('images');
                }}
              />
              <Notifications userId={user?.id || 'guest'} isAdmin={false} />
              {isGuest ? (
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded flex items-center justify-center"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Sign In
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="bg-white/20 rounded-lg p-3 text-white">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-green-100">{user?.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-t border-green-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-white'
                        : 'text-green-100 hover:text-white hover:bg-green-600/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to ReGen Insight
              </h2>
              <p className="text-gray-600 mb-6">
                AI-powered platform for land restoration, water conservation, and carbon credit verification across Kenya's 47 counties
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <Map className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">47 Counties</h3>
                  <p className="text-sm text-blue-100">
                    Comprehensive coverage across all Kenyan counties with real-time environmental data
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <Brain className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                  <p className="text-sm text-green-100">
                    Advanced AI for tree species recommendation and carbon estimation
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <Shield className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Blockchain Verified</h3>
                  <p className="text-sm text-purple-100">
                    Immutable proof-of-carbon ledger for transparent carbon credit verification
                  </p>
                </div>
              </div>
            </div>

            <Charts selectedRegion={selectedRegion} />
          </div>
        )}

        {activeTab === 'map' && <GPSMap selectedRegion={selectedRegion} />}
        {activeTab === 'charts' && <Charts selectedRegion={selectedRegion} />}
        {activeTab === 'images' && <ImageGallery selectedRegion={selectedRegion} />}
        {activeTab === 'most-liked' && <MostLikedImages />}
        {activeTab === 'regen' && <ReGenInsight selectedRegion={selectedRegion} />}
        {activeTab === 'blockchain' && <BlockchainLedger selectedRegion={selectedRegion} />}
        {activeTab === 'contact' && <ContactInfo />}
        {activeTab === 'support' && <UserSupport />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3">Technology Stack</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• AI/ML: TensorFlow, OpenAI</li>
                <li>• GIS: Satellite Imagery Analysis</li>
                <li>• Blockchain: Polygon Network</li>
                <li>• Frontend: React + Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Features</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• GPS Satellite Tracking</li>
                <li>• Community Image Uploads</li>
                <li>• Water Stress Analytics</li>
                <li>• Carbon Credit Verification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Impact</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Environmental Regeneration</li>
                <li>• Economic Empowerment</li>
                <li>• Community Engagement</li>
                <li>• Climate Action</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            © 2025 ReGen Insight | Regenerating the Earth with Intelligence
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

