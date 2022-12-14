const { request } = require("../../server/server_express");

const sequelize=require("../../server/server_express").sequelize;
const User=require("../../server/server_express").User;

function change_name() {
    // Get the values of the first and last name fields
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
  
    // Get the value of the birthday field
    var bday = document.getElementById("bday").value;

  
    // TODO: Add code here to handle the form submission and update the user's name and birthday
    if(bday===""){
        alert('Only name has been changed!');
        
    }
    else{
        alert('All 3 have been changed!')
    }
    return true;
    
  
    // Prevent the form from submitting (optional)
  }
  
  function change_email() {
    // Get the values of the old and new email fields
    var oldEmail = document.getElementById("old_email").value;
    var newEmail = document.getElementById("new_email").value;
  
    // TODO: Add code here to handle the form submission and update the user's email address
  
    // Prevent the form from submitting (optional)
    return false;
  }
  
  function change_password() {
    // Get the values of the old and new password fields
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;
    var passwordRep = document.getElementById("passwordrep").value;
  
    // TODO: Add code here to handle the form submission and update the user's password
  
    // Prevent the form from submitting (optional)
    return false;
  }

