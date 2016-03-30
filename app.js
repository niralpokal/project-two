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

var users= [];
var userNumber = 0;
function User(user){
  this.name = user.name;
  this.pass = user.pass;
  this.handle = user.id;
  this.caption = '';
  this.tweets = [];
  this.numberOfTweets = 0;
  this.followers = [];
  this.following = [];
  this.numberOfFollowers = 0;
  this.numberOfFollowing = 0;
  this.settingColor = 'blue';
  this.notifications = [];
  this.messages =[];
  this.numberOfNotifications = 0;
  this.numberOfMessages = 0;
}
function Tweet(tweet){
  this.date = new Date(Date.now);
  this.text = tweet.text;
  this.handle = tweet.handle;
  this.favs = [];
  this.numberOfFavs = 0
  this.retweets = [];
  this.numberOfRetweets = 0;
  this.tags = tweet.tag;
  this.mentions = tweet.mentions;
}

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
function checkLogin(check){
  for(var i= 0; i< users.length; i++){
    if( check.id == users[i].handle && check.pass == users[i].pass){
      return users[i];
    }
  }
};

function findUser(payload, b){
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
    console.log('Finding something in the database');
    findUsers(db,function(){
      db.close();
      myEvent.emit(b)
    })
  })
};

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
    insertUser(db,function(){
      db.close();
      myEvent.emit(a, neophite)
    })
  })
};

function makeTweet(tweet, a){
  var chirp = new Tweet(tweet);
  var handle = {
    handle:chirp.handle
  }
  var myData ={
    tweets: chirp
  }
  var insertTweet = function(db,callback){
    db.collection('users').update(handle,{ $push: mydata })
  }
   MongoClient.connect(url, function(err,db){
     assert.equal(null,err);
     console.log('I added a new user to the database');
     insertTweet(db,function(){
       db.close();
       myEvent.emit(a)
     })
   })
};

function findFollowingTweets(a,b){
  var tweets = []
  var findUsersTweets = function(db, callback) {
    var cursor = db.collection('users').find();
    cursor.each(function(err, doc) {
       assert.equal(err, null);
       if (doc != null) {
         tweets.push(doc)
       } else {
         callback();
     }
   });
  }
    MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding tweets in the database');
    findUsersTweets(db,function(){
      db.close();
      myEvent.emit(b, tweets)
    })
  })
};

function checkFollowing(user, tweets){
  var payload = []
  for(var i = 0; i<user.length; i++){
    var follow = user[i].handle;
    for(var y = 0; y <tweets.length; y++){
      if (follow == tweets[y].handle){
      var a =  tweets.splice(y,1);
      payload.push(a);
      }
    }
  }
  return payload;
};

function findSuggestions(a){
  var suggestions = [];
  var findUsers = function(db, callback) {
   var cursor = db.collection('users').find().limit(9);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        suggestions.push(doc)
      } else {
        callback();
    }
 });
 }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding something in the database');
    findUsers(db,function(){
      db.close();
      myEvent.emit(a, suggestions)
    })
  })
};

function checkSuggestions(user, suggestions){
  var name = user.handle;
  for (var z = 0; z<suggestions.length; z++){
    if (name == suggestions[z].handle){
      suggestions.splice(z,1);
    }
  }
  for(var i = 0; i<user.following.length; i++){
    var follow = user.following[i].handle;
    for(var y = 0; y <suggestions.length; y++){
      if (follow == suggestions[y].handle){
        suggestions.splice(y,1);
      }
    }
  }
  return suggestions;
};

function addFollower(user, a){
  var handle = {
    handle:user.user
  }
  var handle2 = {
    handle:user.follow
  }
  var myData = {
    following:handle2
  }
  var myData2 = {
    followers:handle
  }
  var updateFollower = function(db,callback){
    db.collection('users').update(handle,{ $push: myData })
    db.collection('users').update(handle,{$inc:{"numberOfFollowing" : 1}})
    db.collection('users').update(handle2,{ $push: myData2 })
    db.collection('users').update(handle2,{ $inc: {"numberOfFollowers": 1}} )
  }
   MongoClient.connect(url, function(err,db){
     assert.equal(null,err);
     console.log('I added a new user to the database');
     updateFollower(db,function(){
       db.close();
       myEvent.emit(a)
     })
   })
}

app.use(express.static('./public/'));

app.get('/home', cookieParser(), function(req,res){
  if(req.cookies.remember == 'true'){
    findUser(req.cookies, 'cookie');
    myEvent.on('cookie', function(){
      for(var i= 0; i< users.length; i++){
        if( req.cookies.user == users[i]._id && req.cookies.id == users[i].handle){
           res.json(users[i]);
        }
      }
    })
  }
})

app.get('/userTimeline', cookieParser(), function(req, res) {
  for(var i= 0; i< users.length; i++){
    if(req.cookies.id == users[i].handle){
      var user = users[i].following;
       findFollowingTweets(users[i].following, 'followingTweets');
       myEvent.on('followingTweets', function(body){
         var payload = checkFollowing(user,body);
         res.json(payload);
      })
    }
  }
});

app.post('/tweet', function(req, res) {
  makeTweet(req.body, 'tweet');
  myEvent.on('tweet', function(){
    res.send(req.body);
  })
});

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


app.get('/suggestions', cookieParser(), function(req, res) {
  for(var i= 0; i< users.length; i++){
    if(req.cookies.id == users[i].handle){
      var user = users[i];
      findSuggestions('suggestions');
       myEvent.on('suggestions', function(body){
        var payload = checkSuggestions(user, body);
        res.json(payload);
      })
    }
  }
});
app.post('/addFollower', jsonParser, function(req, res) {
  console.log(req.body);
  addFollower(req.body, 'addFollower');
  myEvent.on('addFollower', function(){
    res.send();
  })
});

app.post('/login', jsonParser, function(req, res) {
  findUser(req.body, 'send')
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
