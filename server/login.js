const sequelize = require("./server_express").sequelize;
const User = require("./server_express").User;
var crypto = require("crypto");

/**
 * Checks if the email and password given are correct, returns email.
 *
 * @param {String} email The email of the user to find.
 * @param {String} password The password hashed.
 * @return {String} email itself if the password and email matches the database.
 */
async function login(email, password){
    const result = await sequelize.query(`Select email,password From Users where email = '${email}'`);
    if (result[0].length > 0){
        if (result[0][0].password === password) return email;
        else return "Password does not match, try again";
    } else {
        return "User name does not exist, try again";
    }
}

/**
 * Gets the name of the user searched by email.
 *
 * @param {String} email The email of the user to find.
 * @return {String} name, the name registered by the user.
 */
async function getName(email){
    const result = await sequelize.query(`Select name From Users where email = '${email}'`);
    if (result[0].length > 0){
        return result[0][0].name;
    } else {
        return "User name does not exist, try again";
    }
}

/**
 * Checks if the email given corresponds to an admin account, returns true or false.
 *
 * @param {String} email The email of the user to find.
 * @return {Boolean} true if the user is an admin, false otherwise.
 */
async function isAdmin(email){
    const result = await sequelize.query(`Select * From Users where email = '${email}'`);
    if (result[0].length > 0){
        return Boolean(result[0][0].admin);
    } else {
        return false;
    }
}

/**
 * Verifies if the email given is already being used by someone else.
 *
 * @param {String} email The email that has to be checked.
 * @return {Boolean} true if it is already taken, false otherwise.
 */
async function emailTaken(email) {
    const result = await sequelize.query("Select email From Users where email = '" + email + "'");
    return result[0].length > 0;
}

/**
 * Gets all users in the database.
 *
 * @return {Array} The array given by sequelize when all users are requested.
 */
async function getAllUsers(){
    try{
        const result = await sequelize.query("Select * from Users");
        return result[0];
    } catch {
        return [];
    }
}

/**
 * Checks if the Users table in the database is empty or not.
 * If it is, some users are added (by calling addUsersTest function) for testing purposes.
 * 
 * @return {String} "empty Users table" if the table is empty, "Users table is not empty" otherwise.
 */
async function emptyUsersDB(){
    if ((await getAllUsers()).length == 0){
        console.log("empty Users table");
        addUsersTest();
        return "empty Users table";
    } else{
        console.log("Users table is not empty");
        return "Users table is not empty";
    }
}

/**
 * Adds some users to the database for testing purposes.
 *
 * @return {String} "example users added".
 */
function addUsersTest(){
    //static data for testing purposes
    const users = [];

    users.push({
        email: "admin@admin.com",
        birthdate: Date.now(),
        password: crypto.createHash("md5").update("admin").digest('hex'),
        name: "admin",
        phoneNumber: "123456879",
        admin: true
    });

    users.push({
        email: "ajia@ajia.com",
        birthdate: Date.now(),
        password: crypto.createHash("md5").update("ajia").digest('hex'),
        name: "admin",
        phoneNumber: "123456879",
        admin: true
    });

    users.push({
        email: "isaimola@gmail.com",
        birthdate: new Date("2000-11-18"),
        password: crypto.createHash("md5").update("isai").digest('hex'),
        name: "Isaias Antunez Garcia",
        phoneNumber: "123456879"
    });

    users.push({
        email: "abdullahu.eduart@gmail.com",
        birthdate: new Date("2001-01-25"),
        password: crypto.createHash("md5").update("eduart").digest('hex'),
        name: "Eduart Abdullahu",
        phoneNumber: "123456879"
    });

    users.push({
        email: "adhamez10@gmail.com",
        birthdate: new Date("2002-07-03"),
        password: crypto.createHash("md5").update("adham").digest('hex'),
        name: "Adham Elzawawi",
        phoneNumber: "123456879"
    });

    for (let i = 0; i < users.length; i++) {
        User.create(users[i]);
    }

    return "example users added";
}


exports.login = login;
exports.emailTaken = emailTaken;
exports.emptyUsersDB = emptyUsersDB;
exports.isAdmin = isAdmin;
exports.getName = getName;
exports.getAllUsers = getAllUsers;