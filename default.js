var signUpForm = document.getElementById('sign-up');
var loginForm =document.getElementById('login')
var loginButton = document.getElementById('loginButton');
var signUpButton = document.getElementById('signUpButton')
var signUpBtn = document.getElementById('signUpBtn');
var loginBtn = document.getElementById('loginBtn')
var landingPage = document.getElementById('header')
var dashboard = document.getElementById('dashboard')
var userInfo = document.getElementById('userInfo')
var trends = document.getElementById('trends')
var timeline = document.getElementById('timeline');
var tweetBox = document.getElementById('tweetBox');
var submitTweetBtn = document.getElementById('submitTweet');
var suggestions = document.getElementById('suggestions');
var socket = io();
var myUser = {};

var promise = new Promise(function(resolve, reject){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/home', true)
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      resolve(response);
    }
  }
});
promise.then(function(value){
  myUser = value;
  showDashBoard();
})

socket.on('goDash',function(response){
  myUser = response;
  showDashBoard();
})

loginButton.addEventListener('click',function(){
  $('#login').modal('show')
})

signUpButton.addEventListener('click', function(){
  $('#sign-up').modal('show')
});

loginBtn.addEventListener('click', function(event){
  $('#login').modal('toggle');
  event.preventDefault();
  //var xhr = new XMLHttpRequest();
  //xhr.open('POST', '/login', true);
  //xhr.setRequestHeader('Content-Type', 'application/json')
  var id = document.getElementById('loginName').value;
  var pass = document.getElementById('loginPass').value;
  var myData = {
    id:id,
    pass:pass
  }
  socket.emit('login', myData)

  //var payload = JSON.stringify(myData);
  //console.log(payload);
  //xhr.send(payload);
  //xhr.onload = function(){
  //  if (xhr.status === 200){
  //    var response = JSON.parse(xhr.responseText);
  //    myUser = response;
  //    showDashBoard();
  //  }
//  }
})

signUpBtn.addEventListener('click', function(event){
  $('#sign-up').modal('toggle');
  event.preventDefault();
  //var xhr = new XMLHttpRequest();
  //xhr.open('POST', '/signup', true);
  //xhr.setRequestHeader('Content-Type', 'application/json')
  var name = document.getElementById('signUpName').value;
  var handle = document.getElementById('signUpId').value;
  var pass1 = document.getElementById('signUpPass1').value;
  var pass2 = document.getElementById('signUpPass2').value;
  if(pass1 == pass2){
    var myData = {
      name:name,
      id:handle,
      pass:pass1,
    }
    socket.emit('signup', myData);
  //  var payload = JSON.stringify(myData);
  //  xhr.send(payload);
  }else{
    console.log('error');
    pass1.className = 'form-control primary'
    pass2.className = 'form-control primary'
  }
  /*xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      showDashBoard();
    }
  }*/
})

function showDashBoard(){
  landingPage.className = "hidden";
  dashboard.className = "row-fluid"
  appendUserInfo(myUser);
  getUserTimeline();
  getSuggestions();
}

function appendUserInfo(user){
  var thumbnail = document.createElement('div')
  thumbnail.className ="thumbnail"
  var caption = document.createElement('div')
  caption.className="caption"
  var userName = document.createElement('h1');
  var userHandle = document.createElement('p');
  var tweetsBtn = document.createElement('a');
  tweetsBtn.className = "btn btn-default"
  var followersBtn = document.createElement('a');
  followersBtn.className = "btn btn-default"
  var followingBtn = document.createElement('a');
  followingBtn.className = "btn btn-default"
  var userNameText = document.createTextNode(user.name)
  var userHandleText = document.createTextNode('@'+user.handle)
  var numOfTweets = document.createTextNode(user.numberOfTweets);
  var numOfFollowers = document.createTextNode(user.numberOfFollowers);
  var numOfFollowing = document.createTextNode(user.numberOfFollowing);
  var tweets = document.createElement('p');
  var followers = document.createElement('p');
  var following = document.createElement('p');
  var tweetsText = document.createTextNode('Tweets')
  var followingText = document.createTextNode('Following')
  var followersText = document.createTextNode('Followers')
  tweets.appendChild(tweetsText);
  followers.appendChild(followersText);
  following.appendChild(followingText);
  tweetsBtn.appendChild(tweets);
  tweetsBtn.appendChild(numOfTweets);
  followersBtn.appendChild(followers);
  followersBtn.appendChild(numOfFollowers);
  followingBtn.appendChild(following);
  followingBtn.appendChild(numOfFollowing);
  userName.appendChild(userNameText);
  userHandle.appendChild(userHandleText);
  caption.appendChild(userName);
  caption.appendChild(userHandle);
  caption.appendChild(tweetsBtn);
  caption.appendChild(followersBtn);
  caption.appendChild(followingBtn);
  thumbnail.appendChild(caption);
  userInfo.appendChild(thumbnail);
}

function getUserTimeline(){
  var myData = {
    handle:myUser.handle,
    following:myUser.following
  }
  socket.emit('userTimeline', myData);
  socket.on('sendUserTimeline', function(body){
    appendUserTimeline(body);
  })
/*  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/userTimeline', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      var followingTweets = _.sortBy(response, 'date');
      appendUserTimeline(followingTweets);
    }
  }*/
};
function appendUserTimeline(body){
  for(var i = 0; i<body.length; i++){
    var innerTweets = body[i].tweets;
    for(var z = 0; z <innerTweets.length; z++){
      var media = document.createElement('div');
      media.className = "media";
      var mediaLeft = document.createElement('div');
      mediaLeft.className = "media-left";
      var mediaBody = document.createElement('div');
      mediaBody.className = "media-body"
      var h5 = document.createElement('h5');
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      var handle = document.createTextNode('@' + innerTweets[z].handle)
      var name  = document.createTextNode('');
      var tweet = document.createTextNode(innerTweets[z].text)
      p2.appendChild(tweet);
      h5.appendChild(handle);
      mediaBody.appendChild(h5);
      mediaBody.appendChild(p2);
      media.appendChild(mediaLeft);
      media.appendChild(mediaBody);
      timeline.appendChild(media);
    }
  }
}

function getSuggestions(){
  var myData = {
    handle:myUser.handle,
    following:myUser.following
  }
  socket.emit('suggestions', myData);
  socket.on('sendSuggestions',function(body){
    appendSuggestions(body);
  })
/*  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/suggestions', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      console.log(response);
      appendSuggestions(response);
    }
  }*/
}

function appendSuggestions(users){
  console.log(users);
  for(var i = 0; i<users.length; i++){
    var media = document.createElement('div');
    media.className = "media";
    var mediaLeft = document.createElement('div');
    mediaLeft.className = "media-left";
    var mediaBody = document.createElement('div');
    mediaBody.className = "media-body"
    var button = document.createElement('button');
    button.className = "btn btn-default"
    button.setAttribute('data-id', 'follow');
    var buttonText = document.createTextNode('Follow')
    var h5 = document.createElement('h5');
    h5.setAttribute('data-id', users[i].handle)
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    var handle = document.createTextNode('@' + users[i].handle)
  //  var name  = document.createTextNode('');
    //var tweet = document.createTextNode(innerTweets[i].text)
    button.appendChild(buttonText);
    p2.appendChild(button);
    h5.appendChild(handle);
    mediaBody.appendChild(h5);
    mediaBody.appendChild(p2);
    media.appendChild(mediaLeft);
    media.appendChild(mediaBody);
    suggestions.appendChild(media);
  }
}
function addFollower(target){
  var parent = target.parentNode;
  var theParent = parent.parentNode.getElementsByTagName('h5')[0];
  var toFollow = theParent.dataset.id
  //var xhr = new XMLHttpRequest();
  //xhr.open('POST', '/addFollower', true);
  //xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    user:myUser.handle,
    follow:toFollow
  }
  socket.emit('addFollower', myData);

  socket.on('sendNewInfo', function(body){
    myUser = body;
    updateTimeline(body);
  })
  //var payload = JSON.stringify(myData);
//  xhr.send(payload);
/*  xhr.onload = function(){
    if(xhr.status === 200){
      console.log('hello');
      //var response = JSON.parse(xhr.responseText);
      updateTimeline();
    }
  }*/
}
function myTarget(event){
  var ev = event;
  var target = ev.target;
  console.log(target);
  var theTarget = target.dataset.id;
  if (theTarget === 'follow'){
    addFollower(target);
  }
}
function updateTimeline(body){
  removeTimeline();
  removeUserInfo();
  removeSuggestions();
  appendUserInfo(body);
  getUpdateTimeline(body);
  //showDashBoard();
}
function getUpdateTimeline(body){
  myData = {
    handle:body.handle,
    following:body.following
  }
  socket.emit('updateTimeline', myData)
  socket.emit('updateSuggestions', myData)
  socket.once('sendUpdateTweets', function(tweets){
    appendUserTimeline(tweets);
  })
  socket.once('sendNewSuggestions', function(suggestions){
    appendSuggestions(suggestions);
  })
}

function removeTimeline(){
  var element = timeline;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}
function removeUserInfo(){
  var element = userInfo;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}
function removeSuggestions(){
  var element = suggestions;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}
document.body.addEventListener('click', myTarget)
submitTweetBtn.addEventListener('click', function(){
})
