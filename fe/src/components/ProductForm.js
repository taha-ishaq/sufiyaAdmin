import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, FormControl, FormControlLabel, Checkbox, Box } from '@mui/material';

const tagsOptions = ['bridal', 'stitched', 'unstitched', 'new', 'trending','sale'];
const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']; // Add or adjust sizes as needed

const ProductForm = ({ product, onProductSave }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [tags, setTags] = useState(product ? product.tags : []);
  const [sizes, setSizes] = useState(product ? product.sizes : []);
  const [length, setLength] = useState(product ? product.length : '');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null); // State for image preview
  const [secondaryImages, setSecondaryImages] = useState([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setTags(product.tags || []);
      setSizes(product.sizes || []);
      setLength(product.length || '');
      setMainImage(null);
      setMainImagePreview(null); // Reset image preview
      setSecondaryImages([]);
    }
  }, [product]);

  const handleTagChange = (event) => {
    const tag = event.target.value;
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSizeChange = (event) => {
    const size = event.target.value;
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file)); // Set preview URL
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('tags', tags.join(',')); // Convert tags array to comma-separated string
    formData.append('sizes', sizes.join(',')); // Convert sizes array to comma-separated string
    formData.append('length', length);

    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    secondaryImages.forEach((file) => {
      formData.append('secondaryImages', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product saved successfully:', response.data);
      if (onProductSave) {
        onProductSave(response.data);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <FormControl component="fieldset" margin="normal" fullWidth>
        <Box>
          {tagsOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  value={option}
                  checked={tags.includes(option)}
                  onChange={handleTagChange}
                />
              }
              label={option}
            />
          ))}
        </Box>
      </FormControl>
      <FormControl component="fieldset" margin="normal" fullWidth>
        <Box>
          {sizeOptions.map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                  value={size}
                  checked={sizes.includes(size)}
                  onChange={handleSizeChange}
                />
              }
              label={size}
            />
          ))}
        </Box>
      </FormControl>
      <TextField
        label="Length"
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        fullWidth
        margin="normal"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleMainImageChange}
      />
      {mainImagePreview && (
        <div style={{ margin: '10px 0' }}>
          <img src={mainImagePreview} alt="Main Preview" style={{ width: '100px', height: 'auto' }} />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setSecondaryImages([...e.target.files])}
      />
      <Button type="submit" variant="contained" color="primary">Save</Button>
    </form>
  );
};

export default ProductForm;
