const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Sample orders data
let orders = [];

// API routes
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    console.log('Payment intent request received for amount:', amount);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'gbp',
        });

        console.log('Payment intent created:', paymentIntent);
        res.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.post('/save-order', (req, res) => {
    const order = req.body;
    console.log('Order received to save:', order);
    orders.push(order);
    res.status(201).send({ message: 'Order saved successfully' });
});

app.get('/orders', (req, res) => {
    res.status(200).send(orders);
});

// Port configuration for local development
const port = 5002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
