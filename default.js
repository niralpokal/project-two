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
var selectedProfile = document.getElementById('selectedProfile');
var userProfile = document.getElementById('userProfile')
var userSuggestions = document.getElementById('userSuggestions')
var selectedTimeline = document.getElementById('selectedTimeline')
var myUser = {};

var promise = new Promise(function(resolve, reject){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/home', true)
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      resolve(response);
    } else if (xhr.status === 245){
      reject('no cookies');
    }
  }
});

promise.then(function(value){
  myUser = value;
  showDashBoard();
}, function(reason){});

loginButton.addEventListener('click',function(){
  $('#login').modal('show')
})

signUpButton.addEventListener('click', function(){
  $('#sign-up').modal('show')
});

loginBtn.addEventListener('click', function(event){
  $('#login').modal('toggle');
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var id = document.getElementById('loginName').value;
  var pass = document.getElementById('loginPass').value;
  var myData = {
    id:id,
    pass:pass
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if (xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      showDashBoard();
    }
  }
})

signUpBtn.addEventListener('click', function(event){
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
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
    $('#sign-up').modal('toggle');
    var payload = JSON.stringify(myData);
    xhr.send(payload);
  }else{
    console.log('error');
    pass1.className = 'form-control has-error'
    pass2.className = 'form-control has-error'
  }
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      showDashBoard();
    }
  }
})

function showDashBoard(){
  landingPage.className = "hidden";
  dashboard.className = "row-fluid"
  appendUserInfo();
  getUserTimeline();
  getSuggestions(suggestions);
}

function appendUserInfo(){
  var user = myUser;
  var thumbnail = document.createElement('div')
  thumbnail.className ="thumbnail"
  var caption = document.createElement('div')
  caption.className="caption text-center"
  var picture = document.createElement('img');
  picture.setAttribute('src', user.picture);
  picture.setAttribute('alt', "Profile Pic")
  picture.setAttribute('class', "img-responsive")
  var userName = document.createElement('h1');
  userName.className ="text-center"
  var userHandle = document.createElement('p');
  userHandle.className = "text-center"
  var buttonDiv = document.createElement('div');
  buttonDiv.className = "row"
  var column1 = document.createElement('div')
  column1.className = "col-xs-4";
  var column2 = document.createElement('div')
  column2.className = "col-xs-4";
  var column3 = document.createElement('div')
  column3.className = "col-xs-4";
  var tweetsBtn = document.createElement('a');
  tweetsBtn.setAttribute('role', 'button')
  tweetsBtn.setAttribute('data-id', 'userTweets')
  var followersBtn = document.createElement('a');
  followersBtn.setAttribute('role', 'button')
  followersBtn.setAttribute('data-id', 'userFollowers')
  var followingBtn = document.createElement('a');
  followingBtn.setAttribute('role', 'button')
  followingBtn.setAttribute('data-id', 'userFollowing')
  var userNameText = document.createTextNode(captilizeFirstLetter(user.name));
  var userHandleText = document.createTextNode('@'+user.handle)
  var numOfTweets = document.createTextNode(user.numberOfTweets);
  var numOfFollowers = document.createTextNode(user.numberOfFollowers);
  var numOfFollowing = document.createTextNode(user.numberOfFollowing);
  var tweets = document.createElement('p');
  tweets.className="text-muted small text-center"
  var followers = document.createElement('p');
  followers.className ="text-muted small text-center"
  var following = document.createElement('p');
  following.className="text-muted small text-center"
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
  column1.appendChild(tweetsBtn);
  column2.appendChild(followersBtn);
  column3.appendChild(followingBtn);
  buttonDiv.appendChild(column1);
  buttonDiv.appendChild(column2);
  buttonDiv.appendChild(column3);
  caption.appendChild(buttonDiv);
  thumbnail.appendChild(picture);
  thumbnail.appendChild(caption);
  userInfo.appendChild(thumbnail);
}

function getUserTimeline(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/userTimeline', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      var followingTweets = _.sortBy(response, 'date');
      appendUserTimeline(followingTweets, timeline);
    }
  }
};

function appendUserTimeline(body, dom){
  for(var i = 0; i<body.length; i++){
    var innerTweets = body[i].tweets;
    console.log('hi');
    var img = body[i].picture;
    for(var z = 0; z <innerTweets.length; z++){
      var panel = document.createElement('div');
      panel.className = "panel panel-default"
      var panelBody = document.createElement('div');
      panelBody.className = "panel-body";
      var media = document.createElement('div');
      media.className = "media";
      var mediaLeft = document.createElement('div');
      mediaLeft.className = "media-left";
      var mediaBody = document.createElement('div');
      mediaBody.className = "media-body"
      var picture = document.createElement('img')
      picture.setAttribute('src', img);
      picture.setAttribute('alt', "Profile Pic");
      picture.setAttribute('class', "img-rounded")
      picture.setAttribute('width', "48");
      picture.setAttribute('height', "48");
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
      mediaLeft.appendChild(picture);
      media.appendChild(mediaLeft);
      media.appendChild(mediaBody);
      panelBody.appendChild(media);
      panel.appendChild(panelBody)
      dom.appendChild(panel);
      console.log('hello');
    }
  }
}

function getSuggestions(dom){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/suggestions', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      appendSuggestions(response, dom);
    }
  }
}

function appendSuggestions(body, dom){
  var users = body;
  for(var i = 0; i<users.length; i++){
    var panel = document.createElement('div');
    panel.className = "panel panel-default"
    var panelBody = document.createElement('div');
    panelBody.className = "panel-body";
    var media = document.createElement('div');
    media.className = "media";
    var mediaLeft = document.createElement('div');
    mediaLeft.className = "media-left media-middle";
    var mediaBody = document.createElement('div');
    mediaBody.className = "media-body"
    var hr = document.createElement('hr');
    var picture = document.createElement('img');
    picture.setAttribute('src', users[i].picture);
    picture.setAttribute('alt', "Profile Pic");
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', "48");
    picture.setAttribute('height', "48");
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
    mediaLeft.appendChild(picture);
    mediaBody.appendChild(h5);
    mediaBody.appendChild(p2);
    media.appendChild(mediaLeft);
    media.appendChild(mediaBody);
    panelBody.appendChild(media);
    panel.appendChild(panelBody)
    dom.appendChild(panel);
  }
}

function addFollower(target){
  var parent = target.parentNode;
  var theParent = parent.parentNode.getElementsByTagName('h5')[0];
  var toFollow = theParent.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addFollower', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var myData = {
    user:myUser.handle,
    follow:toFollow
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      getUpdatedUser();
    }
  }
}

function getUpdatedUser(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getFollower', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      myUser = response;
      updateTimeline();
    }
  }
}

function makeTweet() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/makeTweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var tweet = tweetBox.value;
  var mentions = [];
  var mentions2 = []
  var tags = [];
  var split  = tweet.split(/\s\w*/);
  for(var i = 0; i<split.length; i++){
    if(split[i].indexOf('@') !== -1){
      mentions.push(split[i]);
    } else if(split[i].indexOf('#') !== -1){
      tags.push(split[i]);
    }
  }
  for(var z =0; z < mentions.length; z++){
    mentions2.push(mentions[z].split(/\@/));
    mentions2[z].splice(0,1);
  }
  mentions.length = 0;
  for(var y = 0; y < mentions2.length; y++){
    mentions.push(mentions2[y][0]);
  }
  var myData = {
    name: myUser.name,
    text: tweet,
    handle: myUser.handle,
    tags: tags,
    mentions: mentions,
    picture: myUser.picture
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ==200){
      document.getElementById('form3').reset();
      getUpdatedUser();
    }
  }
}

function getSelectedProfile(data){
  var myData = {
    handle: data
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/getProfile', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var result = JSON.parse(xhr.responseText);
      console.log(result);
      appendSelectedProfile(result);
    }
  }
};

function appendSelectedProfile(result){
  userProfile.className = 'hidden container-fluid well'
  selectedProfile.className ="container-fluid well"
  var thumbnail = document.createElement('div')
  thumbnail.className ="thumbnail"
  var caption = document.createElement('div')
  caption.className="caption text-center"
  var picture = document.createElement('img');
  picture.setAttribute('src', result.picture);
  picture.setAttribute('alt', "Profile Pic")
  picture.setAttribute('class', "img-rounded")
  picture.setAttribute('width', 150);
  picture.setAttribute('height', 150);
  var br = document.createElement('br');
  var userName = document.createElement('h1');
  userName.className ="text-center"
  var userHandle = document.createElement('p');
  userHandle.className = "text-center"
  var userNameText = document.createTextNode(captilizeFirstLetter(result.name));
  var userHandleText = document.createTextNode('@'+result.handle);
  var buttonDiv = document.createElement('div');
  buttonDiv.className = "row"
  var column1 = document.createElement('div')
  column1.className = "col-xs-6";
  var column2 = document.createElement('div')
  column2.className = "col-xs-6";
  var tweetBtn = document.createElement('a');
  tweetBtn.setAttribute('role', 'button')
  tweetBtn.setAttribute('data-id', 'tweet')
  var messageBtn = document.createElement('a');
  messageBtn.setAttribute('role', 'button')
  messageBtn.setAttribute('data-id', 'message')
  var tweetBtnText = document.createTextNode('Tweet');
  var messageBtnText = document.createTextNode('Message');
  tweetBtn.appendChild(tweetBtnText);
  messageBtn.appendChild(messageBtnText);
  column1.appendChild(tweetBtn);
  column2.appendChild(messageBtn);
  buttonDiv.appendChild(column1);
  buttonDiv.appendChild(column2);
  userName.appendChild(userNameText);
  userHandle.appendChild(userHandleText);
  caption.appendChild(userName);
  caption.appendChild(userHandle);
  caption.appendChild(br);
  caption.appendChild(buttonDiv);
  thumbnail.appendChild(picture);
  thumbnail.appendChild(caption);
  var selectedInfo = document.getElementById('selectedInfo');
  selectedInfo.appendChild(thumbnail);
  var tweetsLi = document.createElement('li')
  tweetsLi.setAttribute('role', 'presentation')
  var followersLi = document.createElement('li')
  followersLi.setAttribute('role', 'presentation')
  var followingLi = document.createElement('li')
  followingLi.setAttribute('role', 'presentation')
  var tweetsBtn = document.createElement('a');
  tweetsBtn.setAttribute('role', 'button')
  tweetsBtn.setAttribute('data-id', 'selectTweets')
  var followersBtn = document.createElement('a');
  followersBtn.setAttribute('role', 'button')
  followersBtn.setAttribute('data-id', 'selectFollowers')
  var followingBtn = document.createElement('a');
  followingBtn.setAttribute('role', 'button')
  followingBtn.setAttribute('data-id', 'selectFollowing')
  followersLi.className=""
  followingLi.className=""
  tweetsLi.className=""
  var tweets = document.createElement('p');
  tweets.className="text-muted small text-center"
  var followers = document.createElement('p');
  followers.className ="text-muted small text-center"
  var following = document.createElement('p');
  following.className="text-muted small text-center"
  var tweetsText = document.createTextNode('Tweets')
  var followingText = document.createTextNode('Following')
  var followersText = document.createTextNode('Followers')
  var numOfTweets = document.createTextNode(result.numberOfTweets);
  var numOfFollowers = document.createTextNode(result.numberOfFollowers);
  var numOfFollowing = document.createTextNode(result.numberOfFollowing);
  tweets.appendChild(tweetsText);
  followers.appendChild(followersText);
  following.appendChild(followingText);
  tweetsBtn.appendChild(tweets);
  tweetsBtn.appendChild(numOfTweets);
  followersBtn.appendChild(followers);
  followersBtn.appendChild(numOfFollowers);
  followingBtn.appendChild(following);
  followingBtn.appendChild(numOfFollowing);
  tweetsLi.appendChild(tweetsBtn);
  followersLi.appendChild(followersBtn);
  followingLi.appendChild(followingBtn);
  var selectedNav = document.getElementById('selectedNav');
  selectedNav.appendChild(tweetsLi);
  selectedNav.appendChild(followersLi);
  selectedNav.appendChild(followingLi);
  getSuggestions(userSuggestions);
  getSelectedTimeline(result);
}

function getSelectedTimeline(result){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/getSelectedTimeline', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var myData = {
  handle: result.handle
  }
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      var body = JSON.parse(xhr.responseText);
      console.log(body.length);
      appendUserTimeline(body, selectedTimeline);
    }
  }
}


function appendFollowers(){

}

function myTarget(event){
  var ev = event;
  var target = ev.target;
  var id = target.id
  console.log(target);
  var theTarget = target.dataset.id;
  if (theTarget == 'follow'){
    addFollower(target);
  }else if(id == 'submitTweet'){
    makeTweet();
  }else if(theTarget == 'userTweets'){
    var data = myUser.handle;
    getSelectedProfile(data);
  }else if(theTarget == 'userFollowers'){

  }else if(theTarget == 'userFollowing'){

  }
}
function updateTimeline(){
  removeTimeline();
  removeUserInfo();
  removeSuggestions();
  appendUserInfo();
  getUserTimeline();
  getSuggestions(suggestions);
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

function captilizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
};

document.body.addEventListener('click', myTarget)
submitTweetBtn.addEventListener('click', function(){
})
