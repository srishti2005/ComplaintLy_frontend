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
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const seenVideo = sessionStorage.getItem('hasSeenVideo');
    const savedComplaints = sessionStorage.getItem('complaints');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (seenVideo) {
      setHasSeenVideo(true);
    }
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    setHasSeenVideo(false);
    sessionStorage.removeItem('hasSeenVideo');
  };

  const markVideoAsSeen = () => {
    setHasSeenVideo(true);
    sessionStorage.setItem('hasSeenVideo', 'true');
  };

  const addComplaint = (complaint) => {
    const newComplaints = [...complaints, complaint];
    setComplaints(newComplaints);
    sessionStorage.setItem('complaints', JSON.stringify(newComplaints));
  };

  const updateComplaintStatus = (complaintId, status) => {
    const updatedComplaints = complaints.map(c => 
      c.complaint_id === complaintId ? { ...c, status } : c
    );
    setComplaints(updatedComplaints);
    sessionStorage.setItem('complaints', JSON.stringify(updatedComplaints));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route 
          path="/video-tutorial" 
          element={<VideoTutorial onComplete={markVideoAsSeen} />} 
        />
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <Signup onSignup={handleLogin} />
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            !hasSeenVideo ? <Navigate to="/video-tutorial" /> :
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              complaints={complaints}
              onUpdateComplaint={updateComplaintStatus}
            />
          } 
        />
        <Route 
          path="/classify" 
          element={
            !hasSeenVideo ? <Navigate to="/video-tutorial" /> :
            <Classify 
              user={user} 
              onLogout={handleLogout} 
              onLogin={handleLogin}
              onAddComplaint={addComplaint}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;