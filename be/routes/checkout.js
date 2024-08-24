const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkoutSchema'); 
const sendOrderNotification = require('../utils/Mailer');    // Adjust the path as needed

// POST route to create a new checkout
router.post('/', async (req, res) => {
    try {
        const {
            phoneNumber,
            country,
            firstName,
            lastName,
            address,
            apartmentSuite,
            city,
            postalCode,
            products, // This should be an array of objects with product details
            sizes, // Array of sizes corresponding to the products
            lengths // Array of lengths corresponding to the products
        } = req.body;

        // Log the received data to check if all required fields are present
        console.log('Received data:', req.body);

        // Create a new checkout document
        const newCheckout = new Checkout({
            phoneNumber,
            country,
            firstName,
            lastName,
            address,
            apartmentSuite,
            city,
            postalCode,
            products,
            sizes, // Include sizes
            lengths // Include lengths
        });

        // Save the document to the database
        await newCheckout.save();

        // Send the email notification
        await sendOrderNotification({
            phoneNumber,
            country,
            firstName,
            lastName,
            address,
            apartmentSuite,
            city,
            postalCode,
            products,
            sizes,
            lengths
        });

        res.status(201).json(newCheckout);
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ message: 'Error creating checkout', error });
    }
});
// GET route to retrieve all checkouts (for admin or review purposes)
router.get('/', async (req, res) => {
    try {
        const checkouts = await Checkout.find().populate({
            path: 'products.productId',
            select: 'name price mainImage' // Ensure you include the fields you need
        }).exec();
        res.json(checkouts);
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ message: 'Error fetching checkouts', error });
    }
});

// GET route to retrieve a specific checkout by ID
router.get('/:id', async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id).populate({
            path: 'products.productId',
            select: 'name mainImage price'
        });
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }
        res.json(checkout);
    } catch (error) {
        console.error('Error fetching checkout:', error);
        res.status(500).json({ message: 'Error fetching checkout', error });
    }
});

// DELETE route to remove a specific checkout by ID
router.delete('/:id', async (req, res) => {
    try {
        const checkout = await Checkout.findByIdAndDelete(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }
        res.status(200).json({ message: 'Checkout deleted' });
    } catch (error) {
        console.error('Error deleting checkout:', error);
        res.status(500).json({ message: 'Error deleting checkout', error });
    }
});

module.exports = router;
