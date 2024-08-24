const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

async function createProduct(productData, imageFilePath) {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageFilePath, {
      folder: 'products', // Optional: Specify a folder in Cloudinary
    });

    // Create a new product
    const newProduct = new Product({
      ...productData,
      image: result.secure_url, // Save the URL of the uploaded image
    });

    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
