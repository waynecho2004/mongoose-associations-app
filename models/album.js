const mongoose = require('mongoose');

// Setu up schemas

const photoSchema = new mongoose.Schema(
    {
        title: String,
        image: String
    },
    { timestamps: true }
);

const albumSchema = new mongoose.Schema(
    {
        name: String,
        // embedded photos in album
        photos: [photoSchema],
    },
    { timestamps: true }
);

// Manipulate data with moels
const Album = mongoose.model('Album', albumSchema);
const Photo = mongoose.model('Photo', photoSchema);

// Export Models
module.exports = { Album, Photo };