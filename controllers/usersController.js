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

// Delete a specic Tweet
router.delete('/:userId/tweets/:tweetId', (req, res) => {
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  console.log('Delete ' + tweetId);

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

module.exports = router;