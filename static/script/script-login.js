const sequelize = require("../../server/server_express").sequelize;
const User = require("../../server/server_express").User;

async function login(email, password){
    const result = await sequelize.query(`Select email,password From Users where email = '${email}'`);
    if (result[0].length > 0){
        if (result[0][0].password === password) return email;
        else return "Password does not match, try again";
    } else {
        return "User name does not exist, try again";
    }
}

async function emailTaken(email) {
    const result = await sequelize.query("Select email From Users where email = '" + email + "'");
    return result[0].length > 0;
}
exports.login = login;
exports.emailTaken = emailTaken;