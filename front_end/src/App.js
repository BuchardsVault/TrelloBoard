import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Overview from './components/Overview';
import Teams from './components/Teams';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Set to true to bypass login

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/overview" 
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teams" 
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;