var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Twitter = require('twitter');
var env = require('var');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/*client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
});
stream.on('error', function(error) {
    throw error;
  });
});*/
//io.on('connection')

var users= [];
var userNumber = 0;
function User(user){
  this.name = user.name;
  this.pass = user.pass;
  this.id = user.id;
  this.email = user.email;
  this.followers = [];
  this.following = [];
  this.numberOfFollowers = 0;
  this.numerOfFollowing = 0;
  this.settingColor = 'blue';
  this.notifications = [];
  this.messages =[];
  this.numberOfNotifications = 0;
  this.numberOfMessages = 0;
}

function newUser(user){
 var neophite = new User(user);
 users.push(neophite);
 userNumber ++;
 return neophite;
}

function checkLogin(check){
  for(var i; i< users.length; i++){
    if( check.id == users[i].id && check.pass == users[i].pass){
      return user[i];
    }
  }
}

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static('./public/'));

app.post('/signup', jsonParser, function(req,res){
  console.log(req.body);
  var result = newUser(req.body);
  res.cookie({});
  res.json(result);
  console.log('We have a new user!' + ' Total number of users: ' + userNumber );
})

app.post('/login', jsonParser, function(req, res) {
  console.log(req.body);
  var result = checkLogin(req.boy);
  res.cookie({});
  res.json(result);
  console.log("I sent settings for: " + req.body.id);
});


server.listen(8080);
