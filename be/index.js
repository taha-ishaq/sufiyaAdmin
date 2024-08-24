const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const Product = require("./models/Product");
const multer = require("multer");
const cors = require("cors");
const adminRoutes = require("./routes/Admin");
const checkoutRoutes = require("./routes/checkout");

// Initialize Express
const app = express();
require("dotenv").config();

// Middleware
// app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // This will enable CORS for all routes

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("HeavenlyDemon65"));

const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage });
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dsvfigpxw",
  api_key: "829993548587123",
  api_secret: "6Q38eXrvc9ajWV5GjgkAXIzje3Q",
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://sufiyakhanum:35xMBpSDDn2Eagt7@cluster0.3xnlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes
app.post(
  "/products",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, price, tags, size, length } = req.body;
      let mainImageUrl = null;
      const secondaryImagesUrls = [];

      if (req.files["mainImage"]) {
        const mainImageFile = req.files["mainImage"][0].buffer;
        const mainImageResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "products" }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            })
            .end(mainImageFile);
        });
        mainImageUrl = mainImageResult;
      }

      if (req.files["secondaryImages"]) {
        for (const file of req.files["secondaryImages"]) {
          const secondaryImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              })
              .end(file.buffer);
          });
          secondaryImagesUrls.push(secondaryImageResult);
        }
      }

      const newProduct = new Product({
        name,
        price,
        tags,
        mainImage: mainImageUrl,
        secondaryImages: secondaryImagesUrls,
        size: size || null,
        length: length || null,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/products", async (req, res) => {
  try {
    const tag = req.query.tag;
    const filter = tag ? { tags: tag } : {}; // Filter based on tag if provided
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});
app.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put(
  "/products/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, price, tags, size, length } = req.body;
      let mainImageUrl = null;
      const secondaryImagesUrls = [];

      if (req.files["mainImage"]) {
        const mainImageFile = req.files["mainImage"][0].buffer;
        const mainImageResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "products" }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            })
            .end(mainImageFile);
        });
        mainImageUrl = mainImageResult;
      }

      if (req.files["secondaryImages"]) {
        for (const file of req.files["secondaryImages"]) {
          const secondaryImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              })
              .end(file.buffer);
          });
          secondaryImagesUrls.push(secondaryImageResult);
        }
      }

      const updatedProductData = {
        name,
        price,
        tags,
        size: size || null,
        length: length || null,
      };

      if (mainImageUrl) {
        updatedProductData.mainImage = mainImageUrl;
      }

      if (secondaryImagesUrls.length > 0) {
        updatedProductData.secondaryImages = secondaryImagesUrls;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedProductData,
        { new: true }
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/orders", async (req, res) => {
  try {
    const { products, total } = req.body;

    // Check if products and total are provided
    if (!products || products.length === 0 || !total) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Create a new order
    const newOrder = new Checkout({
      ...req.body,
      products: products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.use("/admin", adminRoutes);
app.use("/api/checkouts", checkoutRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
