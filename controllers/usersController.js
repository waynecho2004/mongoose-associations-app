const router = require('express').Router();
const user = require('../models/user');
// const User = require('../models/user').User;
// const Tweet = require('../models/user').Tweet;
// You can replace above two line with below line
const { User, Tweet } = require('../models/user');

// NEW USER FORM
router.get('/new', (req, res) => {
  res.render('users/new.ejs');
});

// ADD EMPTY FORM TO USER SHOW PAGE TO ADD TWEET TO A USER
router.get('/:userId', (req, res) => {
  // find user in db by id and add new tweet
  User.findById(req.params.userId, (error, user) => {
    res.render('users/show.ejs', { user });
  });
});

// CREATE A NEW USER
router.post('/', (req, res) => {
  User.create(req.body, (error, user) => {
    // res.send(newUser);
    res.redirect(`/users/${user.id}`);
  });
});

// CREATE TWEET EMBEDDED IN USER
router.post('/:userId/tweets', (req, res) => {
  console.log(req.body);
  // store new tweet in memory with data from request body
  const newTweet = new Tweet({ tweetText: req.body.tweetText });

  // find user in db by id and add new tweet
  User.findById(req.params.userId, (error, user) => {
    user.tweets.push(newTweet);
    user.save((err, user) => {
      res.redirect(`/users/${user.id}`);
    });
  });
});

// Edit tweet embedded in an user
router.get('/:userId/tweets/:tweetId/edit', (req, res) => {
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;

  // find user by user id
  User.findById(userId, (error, foundUser) => {
      // find tweet embedded in album
      const foundTweet = foundUser.tweets.id(tweetId);
      // Update tweet detail and complte with data from request body
      res.render('tweets/edit.ejs', { foundUser, foundTweet });
  });
}) 

// Update tweet embedded in an user
router.put('/:userId/tweets/:tweetId', (req, res) => {
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  const tweetText = req.body.tweetText;

  // find user by user id
  User.findById(userId, (error, foundUser) => {
      // find tweet embedded in user
      const foundTweet = foundUser.tweets.id(tweetId);
      // Update tweet detail and complte with data from request body
      foundTweet.tweetText = tweetText;
      foundUser.save((error, savedUser) => {
          res.redirect(`/users/${foundUser.id}`);
      });
  });
})  


// Index
router.get('/', (req, res) => {
  User.find({}, (error, users) => {
    res.render('users/index.ejs', {
      users,
    })
  })
})

// Delete a specic Tweet
router.delete('/:userId/tweets/:tweetId', (req, res) => {
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  // console.log('Delete tweet ' + tweetId);

  // find user in db by id and remove selected tweet
  User.findById(userId, (error, foundUser) => {
    // find tweet embbed in user
    foundUser.tweets.id(tweetId).remove();
    // update tweet text and complete with data from request body
    foundUser.save((err, savedUser) => {
      res.redirect(`/users/${foundUser.id}`);
    })
  });
});

// Delete a user
router.delete('/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('Delete user ' + userId);

  // find user in db by id and remove selected tweet
  User.findById(userId, (error, foundUser) => {
    // find tweet embbed in user and remove them
    foundUser.tweets.forEach(tweet => {
      foundUser.tweets.id(tweet.id).remove();
    })
    User.findByIdAndRemove(userId, (err) => {
      res.redirect('/users');
    })
  });

});

module.exports = router;