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

// Edit song embedded in an album
router.get('/:albumId/songs/:songId/edit', (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    // find album by album id
    Album.findById(albumId, (error, foundAlbum) => {
        // find song embedded in album
        const foundSong = foundAlbum.songs.id(songId);
        // Update song detail and complte with data from request body
        res.render('songs/edit.ejs', { foundAlbum, foundSong });
    });
}) 

// Update song embedded in an album
router.put('/:albumId/songs/:songId', (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    // find album by album id
    Album.findById(albumId, (error, foundAlbum) => {
        // find song embedded in album
        const foundSong = foundAlbum.songs.id(songId);
        // Update song detail and complte with data from request body
        foundSong.title = req.body.title;
        foundSong.artist = req.body.artist;
        foundAlbum.save((error, savedAlbum) => {
            res.redirect(`/albums/${foundAlbum.id}`);
        });
    });
});

// Delete a specic Song
router.delete('/:albumId/songs/:songId', (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    console.log('Delete song ' + songId);
  
    // find album in db by id and remove selected song
    Album.findById(albumId, (error, foundAlbum) => {
      // find song embbed in album
      foundAlbum.songs.id(songId).remove();
      // update song and complete with data from request body
      foundAlbum.save((err, saveAlbum) => {
        res.redirect(`/albums/${foundAlbum.id}`);
      })
    });
  });

// Delete a user
router.delete('/:albumId', (req, res) => {
    const albumId = req.params.albumId;
    console.log('Delete album ' + albumId);
  
    // find user in db by id and remove selected tweet
    Album.findById(albumId, (error, foundAlbum) => {
      // find tweet embbed in user and remove them
      foundAlbum.songs.forEach(song => {
        foundAlbum.songs.id(song.id).remove();
      })
      Album.findByIdAndRemove(albumId, (err) => {
        res.redirect('/albums');
      })
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
