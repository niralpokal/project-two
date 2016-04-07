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
var userMessages = document.getElementById('userMessages');
var submitTweetBtn = document.getElementById('submitTweet');
var suggestions = document.getElementById('suggestions');
var selectedProfile = document.getElementById('selectedProfile');
var userProfile = document.getElementById('userProfile')
var userSuggestions = document.getElementById('userSuggestions')
var selectedTimeline = document.getElementById('selectedTimeline')
var selectedNav = document.getElementById('selectedNav');
var messagesDiv = document.getElementById('messagesDiv');
var messagesContainer = document.getElementById('messagesContainer')
var myUser = {};
myTweets = {};

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
  getTweets();
  appendUserInfo();
  getSuggestions(suggestions);
}

function getTweets(){
  myTweets.length = 0;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'getTweets', true);
  xhr.send();
  xhr.onload = function(){
    if(xhr.status === 200){
      var result = JSON.parse(xhr.responseText)
      myTweets = result;
      console.log(myTweets);
      getUserTimeline();
    }
  }
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
  picture.setAttribute('data-id', 'thumbnailProfile')
  var userName = document.createElement('h1');
  userName.className ="text-center"
  userName.setAttribute('data-id', myUser.handle)
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
      picture.setAttribute('data-id', 'profile')
      var h5 = document.createElement('h5');
      h5.setAttribute('data-id', innerTweets[z].handle)
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      p2.setAttribute('data-id', innerTweets[z].number)
      p2.setAttribute('data-tweet', innerTweets[z].text)
      var handle = document.createTextNode('@' + innerTweets[z].handle)
      var tweet = document.createTextNode(innerTweets[z].text);
      var favIcon = document.createElement('i');
      favIcon.className ="fa fa-heart-o";
      favIcon.setAttribute('data-id', 'addfavorite');
      for(var y = 0; y < myUser.favs.length; y++){
        if (myUser.favs[y].number == innerTweets[z].number && myUser.favs[y].handle == innerTweets[z].handle){
          favIcon.className="fa fa-heart";
          favIcon.setAttribute('data-id', 'unfavorite')
        }
      }
      var retweetIcon = document.createElement('i');
      retweetIcon.className = "fa fa-retweet";
      retweetIcon.setAttribute('data-id', 'addRetweet');
      if(innerTweets[z].re == 1 && innerTweets[z].retweeter == myUser.handle ){
        retweetIcon.className = "fa fa-retweet blue";
        retweetIcon.setAttribute('data-id', 'removeRetweet');
        handle = document.createTextNode('You retweeted '+'@' + innerTweets[z].handle);
      } else if(innerTweets[z].re == 1){
        handle = document.createTextNode('@'+ innerTweets[z].retweeter + ' retweeted '+'@' + innerTweets[z].handle);
        retweetIcon.className = "fa fa-retweet";
        retweetIcon.setAttribute('data-id', 'cant');
      }
      var fav = document.createElement('li');
      fav.setAttribute('role', 'button');
      var numberOfFavsp = document.createElement('a');
      var numberOfFavs = document.createTextNode(' ' +innerTweets[z].numberOfFavs);
      numberOfFavsp.setAttribute('data-id', 'getfavorites' )
      var numberOfRetweetsp = document.createElement('a');
      var numberOfRetweets = document.createTextNode(' ' +innerTweets[z].numberOfRetweets + "           ");
      numberOfRetweetsp.setAttribute('data-id', 'getRetweets' )
      var br = document.createElement('br');
      var br2 = document.createElement('br');
      var ul = document.createElement('ul')
      ul.className = 'list-inline'
      var retweet = document.createElement('li');
      retweet.setAttribute('role', 'button');
      numberOfRetweetsp.appendChild(numberOfRetweets);
      retweet.appendChild(retweetIcon);
      retweet.appendChild(numberOfRetweetsp);
      numberOfFavsp.appendChild(numberOfFavs)
      fav.appendChild(favIcon);
      fav.appendChild(numberOfFavsp);
      p2.appendChild(tweet);
      p2.appendChild(br)
      h5.appendChild(handle);
      mediaBody.appendChild(h5);
      mediaBody.appendChild(p2);
      ul.appendChild(retweet);
      ul.appendChild(fav);
      mediaBody.appendChild(ul);
      mediaLeft.appendChild(picture);
      media.appendChild(mediaLeft);
      media.appendChild(mediaBody);
      panelBody.appendChild(media);
      panel.appendChild(panelBody);
      dom.appendChild(panel);
      if(innerTweets[z].retweets.length != undefined){
        for (var q = 0; q < innerTweets[z].retweets.length; q++){
          if (innerTweets[z].retweets[q].handle == myUser.handle){
            dom.removeChild(dom.lastChild);
            }
          }
        }
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
    picture.setAttribute('data-id', 'profile')
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

function removeFollower(target){
  var parent = target.parentNode;
  var theParent = parent.getElementsByTagName('h1')[0];
  console.log(theParent);
  var toFollow = theParent.dataset.id
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/removeFollower', true);
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

function addFavorite(target){
  target.className = "fa fa-heart"
  target.setAttribute('data-id', 'unfavorite')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number +1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'addfav', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function unFavorite(target){
  target.className = "fa fa-heart-o"
  target.setAttribute('data-id', 'addfavorite')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number -1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'removefav', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function addRetweet(target){
  target.className = "fa fa-retweet blue"
  target.setAttribute('data-id', 'removeRetweet')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number +1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture,
    retweetNumber: Number(number)
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'addRetweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function removeRetweet(target){
  target.className = "fa fa-retweet"
  target.setAttribute('data-id', 'addRetweet')
  var tweetNumber = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.id
  var tweetText = target.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].dataset.tweet
  var tweetHandle = target.parentNode.parentNode.parentNode.firstChild.dataset.id;
  var number = target.parentNode.lastChild.textContent;
  target.parentNode.lastChild.textContent = (" " + (~~number -1));
  var myData = {
    userHandle: myUser.handle,
    tweetHandle: tweetHandle,
    tweetNumber: tweetNumber,
    tweetText: tweetText,
    userPic: myUser.picture,
    retweetNumber: Number(number)
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'removeRetweet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(myData);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status === 200){
      return;
    }
  }
}

function getUpdatedUser(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getUpdate', true);
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

function getSelectedProfile(data, callback){
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
      appendSelectedProfile(result, callback);
    }
  }
};

function appendSelectedProfile(result, callback){
  userProfile.className = 'hidden container-fluid well'
  selectedProfile.className ="container-fluid well"
  removeSelectedInfo();
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
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
  picture.setAttribute('data-id', 'thumbnailProfile')
  var br = document.createElement('br');
  var userName = document.createElement('h1');
  userName.className ="text-center";
  userName.setAttribute('data-id', result.handle)
  var userHandle = document.createElement('p');
  userHandle.className = "text-center";
  var userText = document.createElement('p');
  userText.className = "small text-center";
  var userNameText = document.createTextNode(captilizeFirstLetter(result.name));
  var userHandleText = document.createTextNode('@'+result.handle);
  var userTextNode = document.createTextNode(captilizeFirstLetter(result.text));
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
  userText.appendChild(userTextNode);
  caption.appendChild(userName);
  caption.appendChild(userHandle);
  caption.appendChild(userText);
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
  var favsLi = document.createElement('li');
  favsLi.setAttribute('role', 'presentation');
  var favsBtn = document.createElement('a');
  favsBtn.setAttribute('role', 'button');
  favsBtn.setAttribute('data-id', 'selectFavs');
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
  var favs = document.createElement('p');
  favs.className = "text-muted text-center small";
  var favsText = document.createTextNode('Favs');
  var numOfFavs = document.createTextNode(result.numberOfFavs);
  var followingText = document.createTextNode('Following')
  var followersText = document.createTextNode('Followers')
  var numOfTweets = document.createTextNode(result.numberOfTweets);
  var numOfFollowers = document.createTextNode(result.numberOfFollowers);
  var numOfFollowing = document.createTextNode(result.numberOfFollowing);
  favs.appendChild(favsText);
  tweets.appendChild(tweetsText);
  followers.appendChild(followersText);
  following.appendChild(followingText);
  tweetsBtn.appendChild(tweets);
  tweetsBtn.appendChild(numOfTweets);
  followersBtn.appendChild(followers);
  followersBtn.appendChild(numOfFollowers);
  followingBtn.appendChild(following);
  followingBtn.appendChild(numOfFollowing);
  favsBtn.appendChild(favs);
  favsBtn.appendChild(numOfFavs);
  tweetsLi.appendChild(tweetsBtn);
  followersLi.appendChild(followersBtn);
  followingLi.appendChild(followingBtn);
  favsLi.appendChild(favsBtn);
  selectedNav.appendChild(tweetsLi);
  selectedNav.appendChild(followersLi);
  selectedNav.appendChild(followingLi);
  selectedNav.appendChild(favsLi);
  removeSelectedSuggestions();
  showSelctedSuggestions();
  getSuggestions(userSuggestions);
  callback(result);
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
      appendUserTimeline(body, selectedTimeline);
    }
  }
}

function getFollowers(result){
  var array = result.followers;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendFollowers(answer);
    }
  }
}

function getFollowing(result){
  var array = result.following;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendFollowing(answer);
    }
  }
}

function getMessages(){
  var array = myUser.following;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendMessages(answer);
    }
  }
}

function appendMessages(result){
  showMessages();
  removeMessages();
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', 60);
    picture.setAttribute('height', 60);
    picture.setAttribute('data-id', 'thumbnailProfile');
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var messageBtn = document.createElement('a');
    messageBtn.setAttribute('role', 'button')
    messageBtn.setAttribute('data-id', 'message')
    var messageText = document.createTextNode('Message');
    messageText.className="text-muted small text-center";
    messageBtn.appendChild(messageText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(messageBtn);
    if(myUser.handle == result[i].handle){
        caption.removeChild(caption.lastChild);
      }
    caption.appendChild(br);
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    messagesDiv.appendChild(col)
  }
}

function getFavs(result){
  var array = result.favs;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/favs', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var payload = JSON.stringify(array);
  xhr.send(payload);
  xhr.onload = function(){
    if(xhr.status ===200){
      var answer = JSON.parse(xhr.responseText);
      appendFavs(answer);
    }
  }
}

function appendFollowers(result){
  removeSelectedTimline();
  removeSelectedSuggestions();
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', 60);
    picture.setAttribute('height', 60);
    picture.setAttribute('data-id', 'thumbnailProfile')
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var followingBtn = document.createElement('a');
    followingBtn.setAttribute('role', 'button')
    followingBtn.setAttribute('data-id', 'unfollow')
    var followingText = document.createTextNode('Unfollow');
    followingText.className="text-muted small text-center";
    var followBtn = document.createElement('a');
    followBtn.setAttribute('role', 'button')
    followBtn.setAttribute('data-id', 'follow')
    var followText = document.createTextNode('Follow');
    followText.className="text-muted small text-center";
    followBtn.appendChild(followText)
    followingBtn.appendChild(followingText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(br);
    caption.appendChild(followBtn);
    var loop = myUser.following
    for(var z =0; z< loop.length; z++){
      if(loop[z].handle == result[i].handle){
        caption.removeChild(caption.lastChild);
        caption.appendChild(followingBtn);
        break;
      }
    }
    if(myUser.handle == result[i].handle){
      caption.removeChild(caption.lastChild);
    }
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    selectedTimeline.appendChild(col)
  }
}

function appendFollowing(result){
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
  getSuggestions(userSuggestions);
  for(var i = 0; i < result.length; i++){
    var col = document.createElement('div');
    col.className="col-xs-6 col-md-4"
    var thumbnail = document.createElement('div')
    thumbnail.className ="thumbnail"
    var caption = document.createElement('div')
    caption.className="caption text-center"
    var picture = document.createElement('img');
    picture.setAttribute('src', result[i].picture);
    picture.setAttribute('alt', "Profile Pic")
    picture.setAttribute('class', "img-rounded")
    picture.setAttribute('width', 60);
    picture.setAttribute('height', 60);
    picture.setAttribute('data-id', 'thumbnailProfile');
    var br = document.createElement('br');
    var userName = document.createElement('h1');
    userName.className ="text-center";
    var userHandle = document.createElement('p');
    userName.setAttribute('data-id', result[i].handle)
    userHandle.className = "text-center";
    var userText = document.createElement('p');
    userText.className = "small text-center";
    var userNameText = document.createTextNode(captilizeFirstLetter(result[i].name));
    var userHandleText = document.createTextNode('@'+result[i].handle);
    var userTextNode = document.createTextNode(captilizeFirstLetter(result[i].text));
    var followingBtn = document.createElement('a');
    followingBtn.setAttribute('role', 'button')
    followingBtn.setAttribute('data-id', 'unfollow')
    var followingText = document.createTextNode('Unfollow');
    followingText.className="text-muted small text-center";
    followingBtn.appendChild(followingText)
    userName.appendChild(userNameText);
    userHandle.appendChild(userHandleText);
    userText.appendChild(userTextNode);
    caption.appendChild(userName);
    caption.appendChild(userHandle);
    caption.appendChild(userText);
    caption.appendChild(followingBtn);
    if(myUser.handle == result[i].handle){
        caption.removeChild(caption.lastChild);
      }
    caption.appendChild(br);
    thumbnail.appendChild(picture);
    thumbnail.appendChild(caption);
    col.appendChild(thumbnail)
    selectedTimeline.appendChild(col)
  }
}

function appendFavs(body){
  removeSelectedTimline();
  removeSelectedSuggestions();
  showSelctedSuggestions();
  getSuggestions(userSuggestions);
  for(var i = 0; i<body.length; i++){
    var innerTweets = body[i].tweets;
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
      picture.setAttribute('data-id', 'profile')
      var h5 = document.createElement('h5');
      h5.setAttribute('data-id', innerTweets[z].handle)
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      p2.setAttribute('data-id', innerTweets[z].number)
      p2.setAttribute('data-tweet', innerTweets[z].text)
      var handle = document.createTextNode('@' + innerTweets[z].handle)
      var tweet = document.createTextNode(innerTweets[z].text);
      var favIcon = document.createElement('i');
      favIcon.className ="fa fa-heart";
      favIcon.setAttribute('data-id', 'unfavorite');
      var retweetIcon = document.createElement('i');
      retweetIcon.className = "fa fa-retweet";
      retweetIcon.setAttribute('data-id', 'addRetweet');
      if(innerTweets[z].retweets.length != undefined){
        for (var q = 0; q < innerTweets[z].retweets.length; q++){
          if (innerTweets[z].retweets[q].handle == myUser.handle){
            retweetIcon.className = "fa fa-retweet blue";
            retweetIcon.setAttribute('data-id', 'removeRetweet');
            handle = document.createTextNode('You retweeted '+'@' + innerTweets[z].handle)
            }
          }
        }
      var fav = document.createElement('li');
      fav.setAttribute('role', 'button');
      var numberOfRetweetsp = document.createElement('a');
      var numberOfRetweets = document.createTextNode(' ' +innerTweets[z].numberOfRetweets + "           ");
      numberOfRetweetsp.setAttribute('data-id', 'getRetweets' )
      var numberOfFavsp = document.createElement('a');
      var numberOfFavs = document.createTextNode(' ' +innerTweets[z].numberOfFavs);
      numberOfFavsp.setAttribute('data-id', 'getfavorites' )
      var br = document.createElement('br');
      var br2 = document.createElement('br');
      var ul = document.createElement('ul')
      ul.className = 'list-inline'
      var retweet = document.createElement('li');
      retweet.setAttribute('role', 'button');
      numberOfRetweetsp.appendChild(numberOfRetweets);
      retweet.appendChild(retweetIcon);
      retweet.appendChild(numberOfRetweetsp);
      numberOfFavsp.appendChild(numberOfFavs)
      fav.appendChild(favIcon);
      fav.appendChild(numberOfFavsp);
      p2.appendChild(tweet);
      p2.appendChild(br)
      h5.appendChild(handle);
      mediaBody.appendChild(h5);
      mediaBody.appendChild(p2);
      ul.appendChild(retweet);
      ul.appendChild(fav);
      mediaBody.appendChild(ul);
      mediaLeft.appendChild(picture);
      media.appendChild(mediaLeft);
      media.appendChild(mediaBody);
      panelBody.appendChild(media);
      panel.appendChild(panelBody);
      selectedTimeline.appendChild(panel);
    }
  }
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
    getSelectedProfile(data, getSelectedTimeline);
  }else if(theTarget == 'userFollowers'){
    var data = myUser.handle;
    getSelectedProfile(data, getFollowers);
  }else if(theTarget == 'userFollowing'){
    var data = myUser.handle;
    getSelectedProfile(data, getFollowing);
  } else if(theTarget == 'selectTweets'){
    var data = findNavParent(target);
    getSelectedProfile(data, getSelectedTimeline);
  } else if(theTarget == 'selectFollowing'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFollowing);
  }else if(theTarget == 'selectFollowers'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFollowers);
  } else if(theTarget == 'profile') {
    var data = target.parentNode.nextSibling.getElementsByTagName('h5')[0].dataset.id;
    getSelectedProfile(data, getSelectedTimeline);
  }else if(theTarget == 'thumbnailProfile') {
    var data = target.nextSibling.firstChild.dataset.id;
    getSelectedProfile(data, getSelectedTimeline);
  } else if(id == 'userHome'){
    removeSelectedInfo();
    removeSelectedTimline();
    removeSelectedSuggestions();
    getUpdatedUser();
  } else if(theTarget == 'addfavorite'){
    addFavorite(target);
  } else if(theTarget == 'selectFavs'){
    var data = findNavParent(target);
    getSelectedProfile(data, getFavs);
  }else if(theTarget == 'unfavorite'){
    unFavorite(target);
  } else if(theTarget == 'unfollow'){
    removeFollower(target);
  }else if(theTarget == 'addRetweet'){
    addRetweet(target);
  }else if(theTarget == 'removeRetweet'){
    removeRetweet(target);
  }else if(id == 'userMessages'){
    getMessages();
  }
}

function findNavParent(target){
  var parent = target.parentNode;
  var theParent = parent.parentNode.parentNode.parentNode.parentNode.previousElementSibling.firstChild.nextSibling.firstChild.getElementsByTagName('h1')[0]
  var handle = theParent.dataset.id;
  return handle;
}

function updateTimeline(){
  userProfile.className = 'container-fluid well'
  selectedProfile.className ="hidden container-fluid well"
  removeTimeline();
  removeUserInfo();
  removeSuggestions();
  appendUserInfo();
  getUserTimeline();
  getSuggestions(suggestions);
}

function showSelctedSuggestions(){
  var sugg = document.getElementById('suggestionsText');
  sugg.className = "row text-center"
  userSuggestions.className = "";
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

function showMessages(){
  landingPage.className = "hidden";
  userProfile.className="hidden";
  selectedProfile.className = "hidden"
  messagesContainer.className="container-fluid well";
}

function removeMessages(){
  var element = messagesDiv;
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

function removeSelectedInfo(){
  var element = selectedInfo;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  var element2 = selectedNav;
  while(element2.firstChild){
    element2.removeChild(element2.firstChild);
  }
};

function removeSelectedSuggestions(){
  var element = userSuggestions;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  var sugg = document.getElementById('suggestionsText');
  sugg.className = "hidden"
  element.className="hidden";
};

function removeSelectedTimline(){
  var element = selectedTimeline;
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
};

function captilizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
};

document.body.addEventListener('click', myTarget)
