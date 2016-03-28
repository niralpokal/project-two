var signUpForm = document.getElementById('sign-up');
var loginForm =document.getElementById('login')
var loginButton = document.getElementById('loginButton');
var signUpButton = document.getElementById('signUpButton')
var signUpBtn = document.getElementById('signUpBtn');
var loginBtn = document.getElementById('loginBtn')


loginButton.addEventListener('click',function(){
  loginForm.className='';
})

signUpButton.addEventListener('click', function(){
  signUpForm.className='';
});

loginBtn.addEventListener('click', function(event){
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
      console.log(response);
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
  var email = document.getElementById('signUpEmail').value;
  var pass1 = document.getElementById('signUpPass1').value;
  var pass2 = document.getElementById('signUpPass2').value;
  if(pass1 == pass2){
    var myData = {
      name:name,
      id:handle,
      email:email,
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
      console.log(response);
    }
  }
})
