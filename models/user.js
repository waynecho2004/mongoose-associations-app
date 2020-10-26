const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  tweetText: String
});

const userSchema = new mongoose.Schema({
  name: String,
  // embed tweets in user
  tweets: [tweetSchema],
}, 

);

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = { User, Tweet };