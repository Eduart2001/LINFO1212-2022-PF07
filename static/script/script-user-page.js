let submit=document.getElementById("clicked");


function change_password() {
    var oldpassword = document.getElementById('oldpassword');
    var newpassword = document.getElementById('newpassword');
    var passwordrep = document.getElementById('passwordrep');
        if (oldpassword.value === newpassword.value) {
            alert('The old password and new password cannot be the same!');
              return false;
        }
         else if(newpassword.value != passwordrep.value){
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
    var oldemail=document.getElementById("old_email");
    var newmail=document.getElementById("new_mail");
    if (oldemail===newmail){
        alert("Cannot change email")
        return false;
    }
    else{
        alert("Email has been successfully changed!")
        return true;
    }

}

var formemail=document.getElementById('formemail')
formemail.addEventListener('email_change', function(event){
    if(!change_email()){
        event.preventDefault();
    }
});




function first_name(){


    const fname=document.getElementById("fname");
    //change first name
}

function last_name(){
    const lname=document.getElementById("fname");
    //change last name
}

function birthday(){
    const bday=document.getElementById("bday");
    //change birthday
}
