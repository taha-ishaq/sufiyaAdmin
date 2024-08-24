import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = ({ onEdit, refreshTrigger }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get('https://sufiya-admin.vercel.app/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios.delete(`https://sufiya-admin.vercel.app/products/${id}`)
      .then(() => {
        // Re-fetch products after deleting
        fetchProducts();
      })
      .catch(error => {
        console.error('There was an error deleting the product!', error);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow key={product._id}>
              <TableCell>
                {product.image.length > 0 && (
                  <img src={product.image[0]} alt={product.name} style={{ width: '100px', height: 'auto' }} />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.tags.join(', ')}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(product._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
