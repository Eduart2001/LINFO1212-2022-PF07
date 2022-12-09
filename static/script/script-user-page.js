const sequelize=require("../../server/server_express").sequelize
const User=require("../../server/server_express").User
var app=require("../../server/server_express").app
var crypto=require("crypto")


function change_password(old_pass,new_pass){
    const check= sequelize.query('Select password from User');
    if(old_pass===new_pass){
        ///check if new pass=old pass
    }
    else if (check===old_pass){
        ///set new pass
        User.password=new_pass;
    }
    else{
        throw new console.error('wrong password given');
    }
}