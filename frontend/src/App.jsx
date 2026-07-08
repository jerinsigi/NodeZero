import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import FanDashboard from './components/FanDashboard';
import StaffDashboard from './components/StaffDashboard';

// Protected Route Wrapper
function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem('nodezero_role');
  if (userRole === role) {
    return children;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/fan" 
          element={
            <ProtectedRoute role="fan">
              <FanDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}