import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BottomNav from './components/common/BottomNav';
import Dashboard from './pages/Dashboard';
import Swipe from './pages/Swipe';
import Hackathons from './pages/Hackathons';
import Profile from './pages/Profile';
import EditProfile from './components/profile/EditProfile';
import Chat from './pages/Chat';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Settings from './pages/Settings';
import Onboarding from './components/auth/Onboarding';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChatList from './pages/ChatList';
import ChatWindow from './pages/ChatWindow';
import LandingPage from './pages/LandingPage';
import Logout from './components/common/Logout'; // <-- Add this import
import PageNotFound from './pages/PageNotFound'; // <-- Add this import

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} /> {/* Logout route */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/swipe" element={
                <ProtectedRoute>
                  <Swipe />
                </ProtectedRoute>
              } />
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatList />
                </ProtectedRoute>
              } />
              <Route path="/chat/:conversationId" element={
                <ProtectedRoute>
                  <ChatWindow />
                </ProtectedRoute>
              } />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/edit" 
                element={<EditProfile />} 
              />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<PageNotFound />} /> {/* Catch-all route */}
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;