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
  foodMenu: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
  },
  drinksMenu: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
  }
}, { timestamps: false, versionKey: false });

const Pin = mongoose.model('Pin', pinSchema, 'pins'); // Use 'pins' collection

// -------------------------

// UPDATED SEARCH ROUTE (using $regex, no text index needed, searches nested menu items)
// GET /search/pins?q=<query> - Search pins by text using regex
app.get('/search/pins', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    return res.status(400).json({ message: 'Search query (q) is required and must be a non-empty string.' });
  }

  try {
    const trimmedQuery = searchQuery.trim();
    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
    const queryRegex = new RegExp(escapedQuery, 'i'); // 'i' for case-insensitive

    const pins = await Pin.find({
      $or: [
        { name: { $regex: queryRegex } },          // Pin's own name
        { description: { $regex: queryRegex } },  // Pin's own description
        { cuisine: { $regex: queryRegex } },        // Pin's cuisine type(s)
        // Search within foodMenu items
        { 'foodMenu.name': { $regex: queryRegex } },        // Name of a food item
        { 'foodMenu.title': { $regex: queryRegex } },       // Title of a food menu header
        { 'foodMenu.description': { $regex: queryRegex } },// Description of a food item
        // Search within drinksMenu items (assuming similar structure)
        { 'drinksMenu.name': { $regex: queryRegex } },       // Name of a drink item
        { 'drinksMenu.title': { $regex: queryRegex } },      // Title of a drinks menu header
        { 'drinksMenu.description': { $regex: queryRegex } } // Description of a drink item
      ]
    })
    .populate('createdBy', 'name email')
    .sort({ name: 1 }); // Default sort by pin name

    res.status(200).json(pins);

  } catch (error) {
    console.error('Error searching pins (regex):', error);
    res.status(500).json({ message: 'Error searching pins', error: error.message });
  }
});
// --- END UPDATED SEARCH ROUTE ---

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

// GET /pins/:pinId/foodMenu
app.get('/pins/:pinId/foodMenu', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId).select('foodMenu'); // Select only the foodMenu field
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.status(200).json(pin.foodMenu || []); // Return the menu or empty array
  } catch (error) {
    console.error('Error fetching food menu:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Pin ID format' });
    }
    res.status(500).json({ message: 'Error fetching food menu', error: error.message });
  }
});

// GET /pins/:pinId/drinksMenu
app.get('/pins/:pinId/drinksMenu', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId).select('drinksMenu'); // Select only the drinksMenu field
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.status(200).json(pin.drinksMenu || []); // Return the menu or empty array
  } catch (error) {
    console.error('Error fetching drinks menu:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Pin ID format' });
    }
    res.status(500).json({ message: 'Error fetching drinks menu', error: error.message });
  }
});

// PUT /pins/:pinId/menu - Update food or drinks menu
app.put('/pins/:pinId/menu', async (req, res) => {
  const { pinId } = req.params;
  const { menuType, menuData } = req.body; // Expecting { menuType: 'food' | 'drinks', menuData: [...] }

  // Validation
  if (!menuType || (menuType !== 'food' && menuType !== 'drinks')) {
    return res.status(400).json({ message: 'Invalid or missing menuType (must be \'food\' or \'drinks\')' });
  }
  if (!Array.isArray(menuData)) {
    return res.status(400).json({ message: 'Invalid or missing menuData (must be an array)' });
  }

  try {
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Update the correct menu
    if (menuType === 'food') {
      pin.foodMenu = menuData;
    } else { // menuType === 'drinks'
      pin.drinksMenu = menuData;
    }

    // Mark as modified if using Mixed type (sometimes needed)
    pin.markModified(menuType === 'food' ? 'foodMenu' : 'drinksMenu'); 

    const updatedPin = await pin.save();
    
    console.log(`${menuType} menu updated for pin ${pinId}`);
    // Respond with just the updated menu array or the whole pin
    res.status(200).json({ message: 'Menu updated successfully', menu: menuType === 'food' ? updatedPin.foodMenu : updatedPin.drinksMenu }); 

  } catch (error) {
    console.error(`Error updating ${menuType} menu for pin ${pinId}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Pin ID format' });
    }
    res.status(500).json({ message: `Error updating ${menuType} menu`, error: error.message });
  }
});

// -----------------

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 