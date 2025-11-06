import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import GetStarted from './pages/GetStarted';
import VideoTutorial from './pages/VideoTutorial';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classify from './pages/Classify';

function App() {
  const [user, setUser] = useState(null);
  const [hasSeenVideo, setHasSeenVideo] = useState(false);
  const [pendingClassification, setPendingClassification] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const seenVideo = localStorage.getItem('hasSeenVideo');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (seenVideo) {
      setHasSeenVideo(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('hasSeenVideo');
    setHasSeenVideo(false);
    setPendingClassification(null);
  };

  const markVideoAsSeen = () => {
    setHasSeenVideo(true);
    localStorage.setItem('hasSeenVideo', 'true');
  };

  const handlePendingClassification = (data) => {
    setPendingClassification(data);
  };

  const clearPendingClassification = () => {
    setPendingClassification(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route 
          path="/video-tutorial" 
          element={
            hasSeenVideo ? <Navigate to="/signup" /> : 
            <VideoTutorial onComplete={markVideoAsSeen} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <Signup 
              onSignup={handleLogin} 
              pendingClassification={pendingClassification}
              onClearPending={clearPendingClassification}
            />
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <Login 
              onLogin={handleLogin}
              pendingClassification={pendingClassification}
              onClearPending={clearPendingClassification}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/classify" 
          element={
            user ? <Classify user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;