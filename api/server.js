require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false, // Deprecated option, remove if causing issues
    // useCreateIndex: true, // Deprecated option, remove if causing issues
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Allowed values
        default: 'user'         // Default value if not provided
    }
}, { timestamps: false, versionKey: false });

const User = mongoose.model('User', userSchema, 'accounts');

// --- Define Pin Schema --- 

// Sub-schema for menu items
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Storing price as Number (e.g., cents or a decimal type)
  description: String,
}, { _id: false }); // Don't create separate _id for menu items

// Main Pin Schema
const pinSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: {
    type: String,
    default: ''
  },
  cuisine: {
    type: [String], // Array of strings
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (in 'accounts' collection)
    required: true
  },
  location: {
    type: {
      type: String, 
      enum: ['Point'], // GeoJSON type: Point
      required: true
    },
    coordinates: {
      type: [Number], // Array of numbers for longitude, latitude
      required: true,
      index: '2dsphere' // Create geospatial index for location queries
    }
  },
  foodMenu: [menuItemSchema],
  drinksMenu: [menuItemSchema]
}, { timestamps: false, versionKey: false });

const Pin = mongoose.model('Pin', pinSchema, 'pins'); // Use 'pins' collection

// -------------------------

// Routes
app.post('/users', async (req, res) => {
    const { name, email, role } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const updateData = {
            name,
            email: email.toLowerCase(),
            ...(role && { role: role })
        };
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        console.log('User upserted:', user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error upserting user:', error);
        res.status(500).json({ message: 'Error saving user data', error: error.message });
    }
});

// --- Pin Routes --- 

// POST /pins - Create a new pin
app.post('/pins', async (req, res) => {
  const { name, latitude, longitude, userId } = req.body;

  // Basic validation
  if (!name || latitude == null || longitude == null || !userId) {
    return res.status(400).json({ message: 'Missing required fields (name, latitude, longitude, userId)' });
  }

  try {
    // Verify user exists (optional but good practice)
    const creator = await User.findById(userId);
    if (!creator) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPin = new Pin({
      name: name,
      createdBy: userId,
      location: {
        type: 'Point',
        // IMPORTANT: GeoJSON coordinates are [longitude, latitude]
        coordinates: [longitude, latitude]
      },
      // Other fields will use schema defaults (empty arrays/strings)
    });

    await newPin.save();
    // console.log('Pin created:', newPin); // Minimize logging
    res.status(201).json(newPin); // Respond with the created pin

  } catch (error) {
    console.error('Error creating pin:', error);
    res.status(500).json({ message: 'Error creating pin', error: error.message });
  }
});

// GET /pins - Fetch all pins
app.get('/pins', async (req, res) => {
  try {
    const pins = await Pin.find({}); // Find all pins
    // console.log(`Fetched ${pins.length} pins`); // Minimize logging
    res.status(200).json(pins);
  } catch (error) {
    console.error('Error fetching pins:', error);
    res.status(500).json({ message: 'Error fetching pins', error: error.message });
  }
});

// -----------------

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 