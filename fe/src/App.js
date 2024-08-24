// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = (status) => {
    setLoggedIn(status);
    if (status) {
      localStorage.setItem('token', 'your-token'); // Set a dummy token or real token
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('token'); // Clear token on logout
  };

  // Sync state with localStorage token
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Layout
        loggedIn={loggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
