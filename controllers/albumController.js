const router = require('express').Router();
const { Album, Song } = require('../models/album');
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

// Create a Song for an existing album
router.get('/:albumId', (req, res) => {
    const albumId = req.params.albumId;
    // Find album in dby by id, then add new Song
    Album.findById(albumId, (error, album) => {
        if(error) res.send(error);
        res.render('albums/show.ejs', { album });
    });
});

// Create a Song Embedded In Album
router.post('/:albumId/songs', (req, res) => {
    const albumId = req.params.albumId;
    console.log(req.body);
    // store new Song in memory with data from request body
    const newSong = new Song(
        { 
            title: req.body.title,
            artist: req.body.artist,
        });
  
    // find user in db by id and add new tweet
    Album.findById(albumId, (error, album) => {
      album.songs.push(newSong)
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
