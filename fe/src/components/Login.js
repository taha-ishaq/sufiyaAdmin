// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography } from '@mui/material';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://sufiya-admin.vercel.app/admin/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Store the JWT token
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <Paper style={{ padding: 16, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: 16 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
