function change_password() {
    var oldpassword = document.getElementById('oldpassword');
    var newpassword = document.getElementById('newpassword');
    var passwordrep = document.getElementById('passwordrep');
        if (oldpassword.value === newpassword.value) {
            alert('The old password and new password cannot be the same!');
              return false;
        }
         else if(newpassword.value !== passwordrep.value){
            alert('Please retype your password correctly');
            return false;
        }
        else 
            {alert('Password has been changed successfully!');
            return true;}
        }
        



var formpass=document.getElementById('formpass');

formpass.addEventListener('password_change', function(event) {
    if (!change_password()) {
      event.preventDefault();
    }
  });

  

function change_email(){
    var oldemail = document.getElementById("old_email");
    var newmail = document.getElementById("new_email");
    console.log("old email: ", oldemail.value, "new email: ", newmail.value);
    if (oldemail.value === newmail.value) {
        alert("Cannot change email");
    } else {
        alert("Email has been successfully changed!");
        console.log("email changed successfully");
    }
    }

var formemail = document.getElementById('formemail');
formemail.addEventListener('email_change', function(event){
    if (!change_email()){
        event.preventDefault();
    }
});


function name_change(){
    alert("hello");
    return true;
}

var formname= document.getElementById("formname");
formname.addEventListener('name_change',function(event){
    if (!name_change){
        event.preventDefault();
    }
})

