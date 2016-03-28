var signUpForm = document.getElementById('sign-up');
var loginButton = document.getElementById('loginButton');
var signUpButton = document.getElementById('signUpButton')

//loginButton.addEventListener('')
signUpButton.addEventListener('click', function(event){
  event.preventDefault();
  signUpForm.className="";
});

signUpForm.addEventListener('submit', function(event){
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
