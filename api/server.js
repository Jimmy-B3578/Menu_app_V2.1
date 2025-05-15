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
  suburb: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String, 
    default: ''
  },
  website: { // New field
    type: String, 
    default: ''
  },
  hours: [{ // New field for opening hours
    day: String,    // e.g., 'Monday', 'Tuesday'
    open: String,   // e.g., '09:00'
    close: String,  // e.g., '17:00'
    isOpen: Boolean // To indicate if the business is open on this day
  }],
  amenities: { // New field for amenities
    type: [String], 
    default: []
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
}, { timestamps: true, versionKey: false }); // Changed timestamps to true

const Pin = mongoose.model('Pin', pinSchema, 'pins'); // Use 'pins' collection

// -------------------------

// UPDATED SEARCH ROUTE (using $regex, searches specific menu item fields)
// GET /search/pins?q=<query> - Search pins by text using regex
app.get('/search/pins', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    return res.status(400).json({ message: 'Search query (q) is required and must be a non-empty string.' });
  }

  try {
    const trimmedQuery = searchQuery.trim();
    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const queryRegex = new RegExp(escapedQuery, 'i'); // 'i' for case-insensitive

    const pins = await Pin.find({
      $or: [
        { name: { $regex: queryRegex } },              // Pin's own name
        { description: { $regex: queryRegex } },      // Pin's own description
        { cuisine: { $regex: queryRegex } },            // Pin's cuisine type(s)
        // Search within foodMenu items (name and description only)
        { 'foodMenu.name': { $regex: queryRegex } },
        { 'foodMenu.description': { $regex: queryRegex } },
        // Search within drinksMenu items (name and description only)
        { 'drinksMenu.name': { $regex: queryRegex } },
        { 'drinksMenu.description': { $regex: queryRegex } }
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

// GET /pins/:pinId - Fetch a single pin by ID
app.get('/pins/:pinId', async (req, res) => {
  const { pinId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pinId)) {
    return res.status(400).json({ message: 'Invalid Pin ID format.' });
  }

  try {
    const pin = await Pin.findById(pinId).populate('createdBy', 'name email'); // Optionally populate createdBy
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found.' });
    }
    res.status(200).json(pin);
  } catch (error) {
    console.error('Error fetching pin by ID:', error);
    res.status(500).json({ message: 'Error fetching pin.', error: error.message });
  }
});

// PUT /pins/:id - Update a pin's details (including menus, hours, amenities)
app.put('/pins/:id', async (req, res) => {
  const { id } = req.params;
  // Include suburb in the destructured and allowed fields
  const { name, description, suburb, phone, website, hours, amenities, foodMenu, drinksMenu, cuisine } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Pin ID' });
  }

  try {
    const pinToUpdate = await Pin.findById(id);
    if (!pinToUpdate) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Basic check: if name is being updated, ensure it's not empty
    if (name !== undefined && name.trim() === '') {
        return res.status(400).json({ message: 'Business name cannot be empty.' });
    }
    // Basic check: if suburb is being updated, ensure it's not empty
    if (suburb !== undefined && suburb.trim() === '') {
        return res.status(400).json({ message: 'Suburb cannot be empty.' });
    }


    // Construct a dynamic update object
    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description; // trim handled by schema
    if (suburb !== undefined) updateFields.suburb = suburb.trim(); // <-- Add suburb to updateFields
    if (phone !== undefined) updateFields.phone = phone;
    if (website !== undefined) updateFields.website = website;
    if (hours !== undefined) updateFields.hours = hours; // Assuming hours structure is validated on client or here
    if (amenities !== undefined) updateFields.amenities = amenities; // Assuming array of strings
    if (foodMenu !== undefined) updateFields.foodMenu = foodMenu;
    if (drinksMenu !== undefined) updateFields.drinksMenu = drinksMenu;
    if (cuisine !== undefined) updateFields.cuisine = cuisine; // Assuming array of strings, or single string

    const updatedPin = await Pin.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures schema rules are applied
    );

    if (!updatedPin) { // Should be redundant given the findById check, but good for safety
        return res.status(404).json({ message: 'Pin not found during update attempt.' });
    }
    
    // console.log('Pin updated:', updatedPin); // Minimize logging
    res.status(200).json(updatedPin);

  } catch (error) {
    console.error('Error updating pin:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating pin', error: error.message });
  }
});

// DELETE /pins/:pinId - Delete a specific pin
app.delete('/pins/:pinId', async (req, res) => {
  const { pinId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pinId)) {
    return res.status(400).json({ message: 'Invalid Pin ID format.' });
  }

  try {
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found.' });
    }

    // TODO: Add backend authorization check here in a real application
    // For example, verify req.user.id === pin.createdBy.toString() || req.user.role === 'admin'

    await Pin.findByIdAndDelete(pinId);
    
    // console.log(`Pin deleted: ${pinId}`);
    res.status(200).json({ message: 'Pin deleted successfully.' });

  } catch (error) {
    console.error('Error deleting pin:', error);
    res.status(500).json({ message: 'Error deleting pin.', error: error.message });
  }
});

// -----------------

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 