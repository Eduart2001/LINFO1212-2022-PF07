const sequelize = require("./server_express").sequelize;
const User = require("./server_express").User;
var crypto = require("crypto");

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

async function getAllUsers(){
    try{
        const result = await sequelize.query("Select * from Users");
        return result[0];
    } catch {
        return [];
    }
}

async function emptyDB(){
    if ((await getAllUsers()).length == 0){
        console.log("empty Users table");
        addUsersTest();
        return "ok";
    } else{
        console.log("Users table is not empty");
        return "not ok";
    }
}

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
exports.emptyDB = emptyDB;