document.getElementById("birthday").max = new Date().toLocaleDateString('en-ca');

function validatePassword(){
    var confirm = document.getElementById("confPassword");
    if (document.getElementById("password").value != confirm.value){
        confirm.setCustomValidity("Passwords don't match");
        //empecher d'avancer dans le serveur
    } else{
        confirm.setCustomValidity('');
    }
}

function validateNumber(){
    var phone = document.getElementById("phone");
    if (phone.value == "") return;
    var valid = true;

    for (let i=0;i<phone.value.length;i++){
        if (!"0123456789".includes(phone.value[i])){
            valid = false;
            break;
        }
    }
    console.log(valid);

    if (!valid || phone.value.length!=9) phone.setCustomValidity("Please enter a valid phone number");
    else phone.setCustomValidity("");
}