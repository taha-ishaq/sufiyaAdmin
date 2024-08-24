import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia, Grid, CircularProgress, Button } from '@mui/material';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://sufiya-admin.vercel.app/api/checkouts');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`https://sufiya-admin.vercel.app/api/checkouts/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId)); // Update UI
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Failed to delete order');
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" align="center">{error}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      {orders.length === 0 ? (
        <Typography variant="h6" align="center">No orders available</Typography>
      ) : (
        <Grid container spacing={4}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography variant="body1">Name: {order.firstName} {order.lastName}</Typography>
                  <Typography variant="body1">Phone: {order.phoneNumber}</Typography>
                  <Typography variant="body1">Address: {order.address}</Typography>
                  <Typography variant="body1">City: {order.city}</Typography>
                  <Typography variant="body1">Postal Code: {order.postalCode}</Typography>
                  <Typography variant="h6" mt={2}>Products:</Typography>
                  {order.products.length === 0 ? (
                    <Typography variant="body1">No products in this order</Typography>
                  ) : (
                    order.products.map((product, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                {product.productId.mainImage ? (
                                  <CardMedia
                                    component="img"
                                    image={product.productId.mainImage}
                                    alt={product.productId.name}
                                    sx={{ width: '100%', height: 'auto' }}
                                  />
                                ) : (
                                  <Typography variant="body2" color="textSecondary">No Image Available</Typography>
                                )}
                              </Grid>
                              <Grid item xs={8}>
                                <Typography variant="body2">Product Name: {product.productId.name}</Typography>
                                <Typography variant="body2">Quantity: {product.quantity}</Typography>
                                <Typography variant="body2">Price: Rs{product.productId.price}</Typography>
                                <Typography variant="body2">Size: {product.size || 'Not specified'}</Typography>
                                <Typography variant="body2">Length: {product.length || 'Not specified'}</Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Box>
                    ))
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(order._id)}
                    sx={{ mt: 2 }}
                  >
                    Delete Order
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrdersPage;
