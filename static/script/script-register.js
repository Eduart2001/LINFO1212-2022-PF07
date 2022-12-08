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