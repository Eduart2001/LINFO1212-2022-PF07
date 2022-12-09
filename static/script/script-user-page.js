let submit=document.getElementById("clicked");

function change_password(old_pass,new_pass,new_pass_rep){

    
    if(old_pass.value===new_pass.value){
        alert('old password is the same as new password');
    
    }
    else if(new_pass.value!==new_pass_rep.value){
        alert(new_pass+" "+new_pass_rep);
    }
    else{alert("hi");}
    

    //add part to change password
}

function email(){
    const mail=document.getElementById("email");
    //change email
}

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
