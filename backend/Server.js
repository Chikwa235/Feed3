require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Define a Donation model
const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
});

const Donation = mongoose.model('Donation', donationSchema);

// API endpoint to handle donations
app.post('/api/donations', async (req, res) => {
  const { name, email, description } = req.body;
    try {
    const newDonation = new Donation({ name, email, description });
    await newDonation.save();
    res.status(201).json({ message: 'Donation submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting donation', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
