document.getElementById("birthday").max = new Date().toLocaleDateString('en-ca');

/**
 * Validates that a password and its confirmation match.
 * The function compares the values of the `password` and `confPassword` fields.
 * If they don't match, it sets a custom validation error message for the `confPassword` field.
 * If they do match, it clears any custom validation error message for the `confPassword` field.
 * 
 * @returns {void}
 */

function validatePassword(){
    var confirm = document.getElementById("confPassword");
    if (document.getElementById("password").value != confirm.value){
        confirm.setCustomValidity("Passwords don't match");
        //empecher d'avancer dans le serveur
    } else{
        confirm.setCustomValidity('');
    }
}
/**
 * Validates that a phone number consists only of digits and is of the correct length.
 * The function gets the value of the `phone` field and checks if it contains only digits.
 * If it doesn't or if it has the wrong length, it sets a custom validation error message for the `phone` field.
 * If it does, it clears any custom validation error message for the `phone` field.
 * 
 * @returns {void}
 */
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