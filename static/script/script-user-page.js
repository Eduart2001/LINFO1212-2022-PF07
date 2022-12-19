const { request } = require("../../server/server_express");
const sequelize=require("../../server/server_express").sequelize;
const User=require("../../server/server_express").User;

async function change_name() {
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
  

  
  function change_password() {
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;
    var passwordRep = document.getElementById("passwordrep").value;
    if (oldPassword===newPassword){
        alert("can't use the same password");
        return false;
    }  
    else if(newPassword!==passwordRep){
        alert("retype the password");
        return false;
    }
    else{
        alert("Password has been changed");
        return true;
    }
  }

function openForm(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    }
module.exports={
    hide_button:hide_button
}
