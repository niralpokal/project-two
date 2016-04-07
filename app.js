var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Twitter = require('twitter');
var env = require('var');
var app = express();
var jsonParser = bodyParser.json();
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
var x;

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
  this.name = tweet.name;
  this.date = new Date;
  this.text = tweet.text;
  this.handle = tweet.handle;
  this.favs = [];
  this.numberOfFavs = 0
  this.retweets = [];
  this.numberOfRetweets = 0;
  this.tags = tweet.tag;
  this.mentions = tweet.mentions;
  this.picture = tweet.picture;
  this.number = Math.random();
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

function findUsers(db, payload, callback){
  globalUsers.length = 0;
  var cursor = db.collection('users').find({},{_id:0,pass:0});
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      globalUsers.push(doc)
    } else {
      callback();
    }
  });
}

function findSelectedUser(db, payload, callback){
  var payload = payload;
  globalUsers.length = 0;
  var myData = {
    handle:payload.handle
  }
  var cursor = db.collection('users').find(myData, {_id:0, pass:0});
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      globalUsers.push(doc)
    } else {
      callback();
    }
  });
}

function checkUser(user){
  for (var i = 0; i< globalUsers.length; i++){
    if(user.handle == globalUsers[i].handle){
      return globalUsers[i];
    }
  }
}

function insertUser(db, neophite, callback){
  db.collection('users').insertOne(neophite, function(err, result) {
    assert.equal(err, null);
    x = result;
    callback();
  })
}

function insertNewTweeter(db, neophite, callback){
  var payload = {
    handle:neophite.handle,
    tweets: [],
    picture:neophite.picture
  }
  db.collection('tweets').insertOne(payload,
  function(err,result){
    assert.equal(err,null);
    callback();
  })
};

function login(res, payload){
  var result = checkLogin(payload);
  res.cookie('user', result._id);
  res.cookie('id', result.handle);
  res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
  res.json(result);
}

function insertTweet(db, chirp, callback){
    var handle = {
      handle:chirp.handle
    }
    var myData ={
      tweets: chirp
    }
    db.collection('tweets').update(handle,{ $push: myData })
    callback();
};

function updateTweets(db, chirp, callback){
  var handle = { handle: chirp.handle };
  var bulk = db.collection('users').initializeUnorderedBulkOp();
  bulk.find(handle).update({$inc: {"numberOfTweets":1}})
  var i =0;
  while(i < chirp.mentions.length){
    var handlex = { handle: chirp.mentions[i]};
    var notification = {
      tweetNumber: chirp.number,
      handle: chirp.handle,
      picture: chirp.picture,
      text: chirp.text
    }
    console.log(handlex);
    bulk.find(handlex).update({$push: { "notifications": notification }})
    bulk.find(handlex).update({$inc: { "numberOfNotifications":1 }})
    i++
  }
  bulk.execute();
  callback();
}

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

function checkFollowingTweets(user, id){
  var payload = []
  var id =id;
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
  for(var z = 0; z<tweets.length; z++){
  if(id == tweets[z].handle){
      var b = tweets[z];
      payload.push(b)
    }
  }
  return payload;
};

function findSuggestions(db, payload, callback) {
  suggestions.length = 0;
  var cursor = db.collection('users').find({}, {_id:0,pass:0}).limit(25);
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

function addFavorite(db,payload,callback){
  var userHandle = {
    handle:payload.userHandle
  }
  var tweetHandle = {
    handle:payload.tweetHandle
  }
  var favs = {
    favs: {
      handle: payload.tweetHandle,
      number: Number(payload.tweetNumber)
    }
  }
  var notification = {
    notifications:{
      tweetNumber:Number(payload.tweetNumber),
      handle:payload.userHandle,
      text:payload.tweetText,
      picture: payload.userPic
    }
  }
  var bulk = db.collection('users').initializeUnorderedBulkOp();
  bulk.find(userHandle).update({ $push: favs });
  bulk.find(userHandle).update({$inc:{"numberOfFavs" : 1}});
  bulk.find(tweetHandle).update({ $push: notification });
  bulk.find(tweetHandle).update({ $inc: {"numberOfNotifications": 1}});
  bulk.execute();
}

function removeFavorite(db,payload,callback){
  var userHandle = {
    handle:payload.userHandle
  }
  var tweetHandle = {
    handle:payload.tweetHandle
  }
  var favs = {
    favs: {
      handle: payload.tweetHandle,
      number: Number(payload.tweetNumber)
    }
  }
  var notification = {
    notifications:{
      tweetNumber:Number(payload.tweetNumber),
      handle:payload.userHandle,
      text:payload.tweetText,
      picture: payload.userPic
    }
  }
  var bulk = db.collection('users').initializeUnorderedBulkOp();
  bulk.find(userHandle).update({ $pull: favs });
  bulk.find(userHandle).update({$inc:{"numberOfFavs" : -1}});
  bulk.find(tweetHandle).update({ $pull: notification });
  bulk.find(tweetHandle).update({ $inc: {"numberOfNotifications": -1}});
  bulk.execute();
}

app.use(express.static('./public/'));

app.get('/home', cookieParser(), function(req,res){
  if(req.cookies.remember == 'true'){
    MongoClient.connect(url, function(err,db){
      assert.equal(null,err);
      console.log('I added a new user to the database');
      findUser(db, req.cookies, function(){
        db.close();
        for(var i= 0; i< myUsers.length; i++){
          if( req.cookies.user == myUsers[i]._id && req.cookies.id == myUsers[i].handle){
            res.json(myUsers[i]);
            break;
          }
        }
      })
    })
  } else {
    res.sendStatus(245);
  }
});

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
          var payload = checkFollowingTweets(user, req.cookies.id);
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

app.post('/removeFollower', jsonParser, function(req, res) {
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
    bulk.find(handle).update({ $pull: myData });
    bulk.find(handle).update({$inc:{"numberOfFollowing" : -1}});
    bulk.find(handle2).update({ $pull: myData2 });
    bulk.find(handle2).update({ $inc: {"numberOfFollowers": -1}});
    bulk.execute();
    db.close();
    res.sendStatus(200);
  })
});

app.get('/getUpdate', cookieParser(), function(req, res){
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am finding a updated user info');
    findUser(db, req.cookies, function(){
      db.close();
      for(var i = 0; i<myUsers.length; i++){
        if(req.cookies.id == myUsers[i].handle){
          res.json(myUsers[i]);
          break;
        }
      }
    })
  })
});

app.post('/makeTweet', jsonParser,function(req, res) {
  var chirp = new Tweet(req.body);
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I added a new tweet to the database');
    insertTweet(db, chirp, function(){
      db.close();
    })
  })
  MongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    console.log('I am updating the tweets for the users');
    updateTweets(db, chirp, function(){
      db.close();
      res.sendStatus(200);
    })
  })
});

app.post('/getProfile', jsonParser, function(req, res) {
  var payload = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am searching for selected user profile');
    findSelectedUser(db, payload, function(){
      db.close();
      var result = checkUser(payload);
      res.json(result);
    })
  })
});

app.post('/getSelectedTimeline', jsonParser, function(req, res) {
  var payload = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    findTweets(db,payload, function(){
      db.close();
      for(var i =0; i<tweets.length; i++){
        if(payload.handle == tweets[i].handle){
          var c = [];
          c.push(tweets[i]);
          res.json(c);
          break;
        }
      }
    })
  })
});

app.post('/followers', jsonParser, function(req, res){
  var payload  = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am finding the followers/following for the user');
    findUsers(db, payload, function(){
      db.close();
      var c = [];
      for(var i = 0; i<globalUsers.length; i++){
        for(var z = 0; z<payload.length; z++){
          if(payload[z].handle == globalUsers[i].handle){
            c.push(globalUsers[i]);
          }
        }
      }
      res.json(c);
    })
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
      console.log(x);
      res.cookie('user', x.ops[0]._id);
      res.cookie('id', neophite.handle);
      res.cookie('remember', true, {expires: new Date(Date.now()+ 900000)})
      res.json(neophite);
    })
  })
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am making a new user tweets');;
    insertNewTweeter(db,neophite, function(){
      db.close()
    })
  })
});

app.post('/favs',jsonParser, function(req, res) {
  var payload = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am finding the followers/following for the user');
    findTweets(db, payload, function(){
      db.close();
      var c = [];
      for(var i = 0; i<tweets.length; i++){
        for(var z = 0; z<payload.length; z++){
          if(payload[z].handle == tweets[i].handle){
            var a ={
              handle:tweets[i].handle,
              tweets:[],
              picture: tweets[i].picture
            }
            for( var y = 0; y< tweets[i].tweets.length; y++){
              if(payload[z].number == tweets[i].tweets[y].number){
                a.tweets.push(tweets[i].tweets[y]);
              }
            }
            c.push(a)
          }
        }
      }
      res.json(c);
    })
  })
});

app.post('/addfav', jsonParser, function(req, res) {
  var payload = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am adding favorites to a person');
    addFavorite(db, payload, function(){
      db.close();
    })
  })
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am updating tweets with the favorites');
    var userHandle = {
      handle:payload.userHandle
    }
    var bulk = db.collection('tweets').initializeUnorderedBulkOp();
    bulk.find({"handle":payload.tweetHandle, 'tweets.number':Number(payload.tweetNumber)}).update({$push: {"tweets.$.favs": userHandle}});
    bulk.find({"handle":payload.tweetHandle,
    'tweets.number':Number(payload.tweetNumber)}).update({$inc:{"tweets.$.numberOfFavs" : 1}});
    bulk.execute();
    db.close();
  })
});

app.post('/removefav', jsonParser, function(req, res) {
  var payload = req.body;
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am removing favorites to a person');
    removeFavorite(db, payload, function(){
      db.close();
    })
  })
  MongoClient.connect(url, function(err,db){
    assert.equal(null,err);
    console.log('I am updating tweets with the favorites');
    var userHandle = {
      handle:payload.userHandle
    }
    var bulk = db.collection('tweets').initializeUnorderedBulkOp();
    bulk.find({"handle":payload.tweetHandle, 'tweets.number':Number(payload.tweetNumber)}).update({$pull: {"tweets.$.favs": userHandle}});
    bulk.find({"handle":payload.tweetHandle,
    'tweets.number':Number(payload.tweetNumber)}).update({$inc:{"tweets.$.numberOfFavs" : -1}});
    bulk.execute();
    db.close();
  })
});

var port = process.env.PORT || 8080;
app.listen(port, function(){});
