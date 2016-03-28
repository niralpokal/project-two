var express = require('express');
var bodyParser = require('body-parser');
var users= [];
var userNumber = 0;
function User(user){
  this.name = user.name;
  this.pass = user.pass;
  this.id = user.id;
  this.email = user.email;
  this.followers = []
  this.following = []
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
    if( check.name == users[i].name && check.pass == users[i].pass){
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
  console.log("I sent settings for: " + result.name);
});


app.listen(8080);
