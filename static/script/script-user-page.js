const { request } = require("../../server/server_express");

const sequelize=require("../../server/server_express").sequelize;
const User=require("../../server/server_express").User;

function change_name() {
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
  
    var bday = document.getElementById("bday").value;

  
    if(bday===""){
        alert('Only name has been changed!');
        
    }
    else{
        alert('All 3 have been changed!')
    }
    return true;
    
  
  }
  
  function change_email() {
    var oldEmail = document.getElementById("old_email").value;
    var newEmail = document.getElementById("new_email").value;
  
    if (oldEmail==newEmail){
        alert("Can't use the old email");
        return false;
    }
  
    return true;
  }
  
  function change_password() {
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;
    var passwordRep = document.getElementById("passwordrep").value;
    if (oldPassword===newPassword){
        alert("can't use the same password");
        return false;
    }  
    else if(newPassword===passwordRep){
        alert("retype the password");
        return false;
    }
    else{
        alert("Password has been changed");
        return true;
    }
  }

