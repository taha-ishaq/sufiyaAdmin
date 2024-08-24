import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import { Button, Typography } from '@mui/material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://sufiya-admin.vercel.app/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSave = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sufiya-admin.vercel.app/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Product Management</Typography>
      <ProductForm product={editingProduct} onProductSave={handleProductSave} />
      <div>
        {products.map((product) => (
          <div key={product._id} style={{ marginBottom: '20px' }}>
            <Typography variant="h6">{product.name}</Typography>
            <img src={product.image} alt={product.name} style={{ width: '100px', display: 'block' }} />
            <div>
              {product.secondaryImages && product.secondaryImages.map((img, index) => (
                <img key={index} src={img} alt={`Secondary ${index}`} style={{ width: '50px', margin: '5px' }} />
              ))}
            </div>
            <Button onClick={() => handleDelete(product._id)} variant="contained" color="error">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
