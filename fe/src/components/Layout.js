import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import ProductManagement from './ProductManagement';
import OrderDetails from './OrderDetails';
import Navbar from './Navbar'; // Import Navbar component
import axios from 'axios';

const Layout = ({ loggedIn, onLoginSuccess, onLogout }) => {
  const [hasNewOrderData, setHasNewOrderData] = useState(false);

  useEffect(() => {
    // Polling or socket connection to check for new order data
    const checkForNewOrderData = async () => {
      try {
        const response = await axios.get('https://sufiya-admin.vercel.app/api/orders/new-data'); // Endpoint for checking new data
        if (response.data.hasNewData) {
          setHasNewOrderData(true);
        } else {
          setHasNewOrderData(false);
        }
      } catch (error) {
        console.error('Error fetching new order data', error);
      }
    };

    checkForNewOrderData();

    // Optionally set up an interval to periodically check for new data
    const intervalId = setInterval(checkForNewOrderData, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar hasNewOrderData={hasNewOrderData} /> {/* Pass notification status */}
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/admin" />
            ) : (
              <Login onLoginSuccess={() => onLoginSuccess(true)} />
            )
          }
        />
        <Route
          path="/admin"
          element={loggedIn ? <ProductManagement onLogout={() => onLogout(false)} /> : <Navigate to="/login" />}
        />
        <Route
          path="/order"
          element={loggedIn ? <OrderDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/admin" : "/login"} />}
        />
      </Routes>
    </>
  );
};

export default Layout;
