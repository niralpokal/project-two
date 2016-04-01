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

var myUsers= [];
var globalUsers =[]
var suggestions = [];
var tweets= [];
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
  this.picture = "https://abs.twimg.com/sticky/default_profile_images/default_profile_0_200x200.png"
}
function Tweet(tweet){
  this.name = tweet.name
  this.date = new Date(Date.now);
  this.text = tweet.text;
  this.handle = tweet.handle;
  this.favs = [];
  this.numberOfFavs = 0
  this.retweets = [];
  this.numberOfRetweets = 0;
  this.tags = tweet.tag;
  this.mentions = tweet.mentions;
  this.picture = tweet.picture;
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
  for(var i= 0; i< myUsers.length; i++){
    if( check.id == myUsers[i].handle && check.pass == myUsers[i].pass){
      return myUsers[i];
    }
  }
};

function findUser(db, payload, callback) {
  var payload = payload;
  myUsers.length = 0;
  var myData = {
    handle:payload.id
  }
  var cursor = db.collection('users').find(myData);
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      myUsers.push(doc)
    } else {
      callback();
    }
  });
}

function insertUser(db, neophite, callback){
  db.collection('users').insertOne(neophite, function(err, result) {
    assert.equal(err, null);
    callback();
  })
}

function login(res, payload){
  var result = checkLogin(payload);
  res.cookie('user', result._id);
  res.cookie('id', result.handle);
  res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
  res.json(result);
}

function newUser(user, a){


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

function findTweets(db, payload, callback) {
  tweets.length = 0;
  var cursor = db.collection('tweets').find();
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      tweets.push(doc)
    } else {
      callback();
    }
  })
}



function updateFindTweets(a){
  var updateTweets = []
  var upTweets = function(db, callback) {
    var cursor = db.collection('tweets').find();
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        updateTweets.push(doc)
      } else {
        callback();
      }
    });
  }
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('Finding updated tweets in the database');
    upTweets(db,function(){
      db.close();
      myEvent.emit(a)
    })
  })
};


function checkFollowingTweets(user){
  var payload = []
  var user = user;
  for(var i = 0; i<user.length; i++){
    var follow = user[i].handle;
    for(var y = 0; y <tweets.length; y++){
      if (follow == tweets[y].handle){
        var a = tweets[y];
        payload.push(a);
      }
    }
  }
  return payload;
};



function findSuggestions(db, payload, callback) {
  suggestions.length = 0;
  var cursor = db.collection('users').find().limit(25);
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      suggestions.push(doc)
    } else {
      callback();
    }
  })
}



function checkSuggestions(user){
  var sugg = suggestions;
  var name = user.handle;
  for (var z = 0; z<sugg.length; z++){
    if (name == sugg[z].handle){
      sugg.splice(z,1);
    }
  }
  for(var i = 0; i<user.following.length; i++){
    var follow = user.following[i].handle;
    for(var y = 0; y <sugg.length; y++){
      if (follow == sugg[y].handle){
        sugg.splice(y,1);
      }
    }
  }
  return sugg;
};



app.use(express.static('./public/'));

/*app.get('/home', cookieParser(), function(req,res){
  if(req.cookies.remember == 'true'){
    findUser(req.cookies, 'cookie');
    myEvent.on('cookie', function(){
      for(var i= 0; i< myUsers.length; i++){
        if( req.cookies.user == myUsers[i]._id && req.cookies.id == myUsers[i].handle){
          res.json(myUsers[i]);
          res.end();
        }
      }
    })
  } else{
    //res.send(245);
    console.log('no cookies');
  }
})
*/

app.post('/login', jsonParser, function(req, res) {
  var payload = req.body
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('finding a user');
    findUser(db, payload, function(){
      db.close();
      login(res,payload);
    })
  })
});

app.get('/userTimeline', cookieParser(), function(req, res) {
  for(var i= 0; i< myUsers.length; i++){
    if(req.cookies.id == myUsers[i].handle){
      var user = myUsers[i].following;
      MongoClient.connect(url, function(err,db){
        assert.equal(null,err);
        console.log('Finding tweets in the database');
        findTweets(db, user, function(){
          db.close();
          var payload = checkFollowingTweets(user);
          res.json(payload);
        })
      })
      break;
    }
  }
})

app.get('/suggestions', cookieParser(), function(req, res) {
  for(var i= 0; i< myUsers.length; i++){
    if(req.cookies.id == myUsers[i].handle){
      var user = myUsers[i];
      MongoClient.connect(url, function(err,db){
        assert.equal(null,err);
        console.log('Finding suggestions');
        findSuggestions(db,user,function(){
          db.close();
          var payload = checkSuggestions(user);
          res.json(payload);
        })
      })
      break;
    }
  }
});

app.post('/addFollower', jsonParser, function(req, res) {
  var user = req.body;
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
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am updating followers');
    var bulk = db.collection('users').initializeUnorderedBulkOp();
    bulk.find(handle).update({ $push: myData });
    bulk.find(handle).update({$inc:{"numberOfFollowing" : 1}});
    bulk.find(handle2).update({ $push: myData2 });
    bulk.find(handle2).update({ $inc: {"numberOfFollowers": 1}});
    bulk.execute();
    db.close();
    res.sendStatus(200);
  })
});

app.get('/getFollower', cookieParser(), function(req, res){
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am finding a updated user info');
    findUser(db, req.cookies, function(){
      db.close();
      for(var i = 0; i<myUsers.length; i++){
        if(req.cookies.id == myUsers[i].handle){
          console.log('hi');
          res.json(myUsers[i]);
          break;
        }
      }
    })
  })
});


app.post('/tweet', jsonParser,function(req, res) {
  makeTweet(req.body, 'tweet');
  myEvent.on('tweet', function(){
    res.send(req.body);
    res.end()
  })
});

app.post('/signup', jsonParser, function(req,res){
  var neophite = new User(req.body);
  myUsers.push(neophite);
  userNumber ++;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I added a new user to the database');
    insertUser(db, neophite, function(){
      db.close();
      res.cookie('user', result._id);
      res.cookie('id', result.handle);
      res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
      res.json(neophite);
    })
  })
});







/*io.on('connection', function(socket){
socket.on('login', function(body){
myUsers.length =0;
suggestions.length =0;
findUser(body, 'send');
myEvent.on('send', function(){
var result = checkLogin(body);
socket.emit('goDash', result);
})
})
socket.on('signup', function(body){
newUser(body, 'newsignup');
myEvent.on('newsignup', function(result){
socket.emit('goDash', result)
})
})
socket.on('userTimeline', function(body){
for(var i= 0; i< myUsers.length; i++){
if(body.handle == myUsers[i].handle){
var user = myUsers[i].following;
tweets.length =0;
findTweets('followingTweets');
myEvent.on('followingTweets', function(a){
var payload = checkFollowingTweets(user,a);
socket.emit('sendUserTimeline', payload)
})
}
}
})
socket.on('suggestions', function(body){
for(var i= 0; i< myUsers.length; i++){
if(body.handle == myUsers[i].handle){
var user = myUsers[i];
findSuggestions('eventSuggestions');
myEvent.on('eventSuggestions', function(a){
var payload = checkSuggestions(user);
socket.emit('sendSuggestions', payload)
})
}
}
})
socket.on('addFollow', function(body){
var user = body;
addFollower(body, 'eventAddFollower');
console.log(1);
myEvent.on('eventAddFollower', function(){//it is emitting this twice on the second click
myUsers.length = 0;
console.log(myUsers);
findUpdateUser(user, 'updateUser');//runs this twice
myEvent.on('updateUser', function(){
for (var i = 0; i<myUsers.length; i++){
if(user.user == myUsers[i].handle){
var payload = myUsers[i];
console.log(2);//runs this 9 times
socket.emit('sendUpdateUser', payload);
}
}
})
})
});
socket.on('updateTimeline', function(body){
var user = body.following;
tweets.length = 0;
findTweets('updateTweets')//runs this 18 times
myEvent.on('updateTweets', function(something){
var payload = checkFollowingTweets(user);
socket.emit('sendUpdateTweets', payload)
return;
})
})
socket.on('updateSuggestions', function(body){
var user = body;
var payload = checkSuggestions(user);
socket.emit('sendNewSuggestions', payload)
return;
})
});
*/



server.listen(8080);
