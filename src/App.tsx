import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Events from './pages/Events';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminGames from './pages/admin/AdminGames';
import AdminEvents from './pages/admin/AdminEvents';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSettings from './pages/admin/AdminSettings';
import AdminConsoles from './pages/admin/AdminConsoles';
import Consoles from './pages/Consoles';
import GameDetail from './pages/GameDetail';
import EventDetail from './pages/EventDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-gaming">
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="consoles" element={<AdminConsoles />} />
            <Route path="games" element={<AdminGames />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* User Routes - With Header/Footer */}
          <Route path="/*" element={
            <>
              <Header />
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/games/:slug" element={<GameDetail />} />
                  <Route path="/consoles" element={<Consoles />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </motion.main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;