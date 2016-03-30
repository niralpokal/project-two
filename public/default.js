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
  console.log(value);
  myUser = value;
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
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  var id = document.getElementById('loginName').value;
  var pass = document.getElementById('loginPass').value;
  console.log(id);
  console.log(pass);
  var myData = {
    id:id,
    pass:pass
  }
  var payload = JSON.stringify(myData);
  console.log(payload);
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
  $('#sign-up').modal('toggle');
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
    var payload = JSON.stringify(myData);
    xhr.send(payload);
  }else{
    console.log('error');
    pass1.className = 'form-control primary'
    pass2.className = 'form-control primary'
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
  appendUserInfo(myUser);
  appendTimeline(myUser);
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

function appendTimeline(user){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/userTimeline', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var response = JSON.parse(xhr.responseText);
      console.log(_.sortBy(response, 'date'));
    }
  }
}
submitTweetBtn.addEventListener('click', function(){
})
