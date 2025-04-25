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
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema, 'accounts');

// Routes
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() }, // find a document with this filter
            { name, email: email.toLowerCase() }, // document to insert when nothing was found
            { new: true, upsert: true, runValidators: true } // options
        );
        console.log('User upserted:', user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error upserting user:', error);
        res.status(500).json({ message: 'Error saving user data', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 