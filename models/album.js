const mongoose = require('mongoose');

// Setu up schemas

const songSchema = new mongoose.Schema(
    {
        title: String,
        artist: String,
    },
    { timestamps: true }
);

const albumSchema = new mongoose.Schema(
    {
        name: String,
        // embedded Songs in album
        songs: [songSchema],
    },
    { timestamps: true }
);

// Manipulate data with moels
const Album = mongoose.model('Album', albumSchema);
const Song = mongoose.model('Song', songSchema);

// Export Models
module.exports = { Album, Song };