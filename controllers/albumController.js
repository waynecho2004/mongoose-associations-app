const router = require('express').Router();
const { Album, Photo } = require('../models/album');
module.exports = router;

// New Album
router.get('/new', (req, res) => {
    res.render('albums/new.ejs');
});

// Create a new album
router.post('/', (req, res) => {
    Album.create(req.body, (error, newAlbum) => {
        if(error) res.send(error);
        res.redirect(`/albums/${newAlbum.id}`);
    });
});

// Create a photo for an existing album
router.get('/:albumId', (req, res) => {
    const albumId = req.params.albumId;
    // Find album in dby by id, then add new photo
    Album.findById(albumId, (error, album) => {
        if(error) res.send(error);
        res.render('albums/show.ejs', { album });
    });
});