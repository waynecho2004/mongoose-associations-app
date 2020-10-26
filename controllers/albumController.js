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

// Create a photo Embedded In Album
router.post('/:albumId/photos', (req, res) => {
    const albumId = req.params.albumId;
    console.log(req.body);
    // store new photo in memory with data from request body
    const newPhoto = new Photo(
        { 
            title: req.body.title,
            image: req.body.image,
        });
  
    // find user in db by id and add new tweet
    Album.findById(albumId, (error, album) => {
      album.photos.push(newPhoto)
      album.save((err, album) => {
        res.redirect(`/albums/${album.id}`);
      });
    });
  });

// Index
router.get('/', (req, res) => {
    Album.find({}, (error, albums) => {
      res.render('albums/index.ejs', {
        albums,
      })
    })
  })
