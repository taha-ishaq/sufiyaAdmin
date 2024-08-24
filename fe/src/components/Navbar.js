import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Badge } from '@mui/material';

const Navbar = ({ hasNewOrderData }) => {
  const location = useLocation();
  const showNavbar = location.pathname === '/admin' || location.pathname === '/order';

  return (
    showNavbar && (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
          {location.pathname === '/admin' && (
            <Button color="inherit" component={Link} to="/order">
              <Badge color="error" variant={hasNewOrderData ? "dot" : "standard"}>
                Order
              </Badge>
            </Button>
          )}
          {location.pathname === '/order' && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}
        </Toolbar>
      </AppBar>
    )
  );
};

export default Navbar;
