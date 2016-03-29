var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Twitter = require('twitter');
var env = require('var');
var app = express();
var jsonParser = bodyParser.json();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/user'
const EventEmitter = require('events');
const myEvent = new EventEmitter();

function searchMongo(payload, b){
  var findUsers = function(db, callback) {
  var myData = {
    handle:payload.id
  }
   var cursor = db.collection('users').find(myData);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        users.push(doc)
      } else {
        callback();
    }
 });
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding something in the dateabase');
    findUsers(db,function(){
      db.close();
      myEvent.emit(b)
    })
  })
};

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

/*io.on('connection', function(socket){
  console.log('we are connected');
});*/

var users= [];
var userNumber = 0;
function User(user){
  this.name = user.name;
  this.pass = user.pass;
  this.handle = user.id;
  this.tweets = [];
  this.numberOfTweets = 0;
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

function newUser(user, a){
 var neophite = new User(user);
 users.push(neophite);
 userNumber ++;
 var insertUser = function(db,callback){
   db.collection('users').insertOne(neophite, function(err, result) {
   assert.equal(err, null);
   callback();
  })
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I added a new user to the database');
    newUser(db,function(){
      db.close();
      myEvent.emit(a, neophite)
    })
  })
};

function checkLogin(check){
  for(var i= 0; i< users.length; i++){
    if( check.id == users[i].handle && check.pass == users[i].pass){
      return users[i];
    }
  }
};

app.use(express.static('./public/'));

app.get('/home', cookieParser(), function(req,res){
  if(req.cookies.remember == 'true'){
    searchMongo(req.cookies, 'cookie');
    myEvent.on('cookie', function(){
      for(var i= 0; i< users.length; i++){
        if( req.cookies.user == users[i]._id && req.cookies.id == users[i].handle){
           res.json(users[i]);
        }
      }
    })
  }
})

app.post('/signup', jsonParser, function(req,res){
  newUser(req.body, 'signup');
  myEvent.on('signup', function(result){
    res.cookie('user', result._id);
    res.cookie('id', result.handle);
    res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
    res.json(result);
    console.log('We have a new user!' + ' Total number of users: ' + userNumber );
  })
});

app.post('/login', jsonParser, function(req, res) {
  searchMongo(req.body, 'send')
  myEvent.on('send', function(){
    var result = checkLogin(req.body);
    res.cookie('user', result._id);
    res.cookie('id', result.handle);
    res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
    res.json(result);
    console.log("I sent settings for: " + req.body.id);
  })
});

server.listen(3000);
