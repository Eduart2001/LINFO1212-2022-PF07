var express = require('express');
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var https = require("https");
var fs = require('fs');
var app = express ()


app.set('view engine', 'ejs');

app.set('public', path.join(__dirname, '../static/css'));
app.set('views', path.join(__dirname, '../static/templates'));
app.use(express.static(path.join(__dirname, '../static')));
app.use("/css",express.static(path.join(__dirname, "'../static/css")))

app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.json());

app.use(session({
    secret: "climax123",
    resave:false,
    saveUninitialized:true,
    cookie:{
        path:"/",
        httpOnly:true
    }
}));

//database
const sequelize = require("../Database/database");
const User = require("../Database/User");
const Hall = require("../Database/Hall");
const TimeTable = require("../Database/TimeTable");
const Movie = require("../Database/Movie");
const Seat = require("../Database/Seat");
sequelize.sync().then(() => {login.emptyDB(), console.log("db is ready")});

// exports variables
module.exports={
    app: app,
    sequelize: sequelize,
    User : User,
    Hall : Hall,
    TimeTable :TimeTable, 
    Movie :Movie,
    Seat :Seat
}

//imports
const login = require("./login");
// const movie = require("./movie");


app.get('/', async function(req,res,next){
    res.render('home_page.ejs');
});

//login
app.get('/login', function(req,res,next){
    // req.query.username = "";
    if (req.query.incorrect){
        res.render('login_page.ejs', {incorrect: "The username or the password you entered was incorrect"});
    } else {
        res.render('login_page.ejs', {incorrect: ""});
    }
});

app.post('/ident', async function(req, res, next){
    var hash = crypto.createHash("md5").update(req.body.password).digest('hex');
    let result = await login.login(req.body.email, hash);
    if (result == req.body.email){
        req.session.username = result.split("@")[0];
        res.redirect('/');
    } else res.redirect('/login?incorrect=true');
});

app.post('/signUp', async function(req, res, next){
    const email = req.body.email.toLowerCase();

    if (await login.emailTaken(email)) res.render('register_page.ejs', {incorrect: "Email is already being used"});
    else{
        try {
            User.create({
                email: email,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                birthdate: req.body.birthdate,
                password: crypto.createHash("md5").update(req.body.password1).digest('hex'),
                admin: false
            }).then(console.log("User added"));

            res.redirect("/login");
        } catch (e){
            res.render('register_page.ejs', {incorrect: "User was not created, data missing : " + e});
        }
    }
});

app.get('/register', function(req, res, next){
    res.render('register_page.ejs', {incorrect: ""});
});

app.get('/movie', async function(req, res, next){
    let result = movie.getMovieById(req.query.id);
    res.render('movie_page.ejs')
});

app.get('/admin/add_movie', function(req,res,next){
    res.render('add_movie.ejs');
});
app.get('/admin/modify_movie', function(req,res,next){
    res.render('modify_movie.ejs');
});
app.get('/admin/time_table', function(req,res,next){
    res.render('time_table.ejs',{data : [{id:"1",name:"spider-man"},{id:"2",name:"spider-man"},{id:"3",name:"spider-man"},{id:"4",name:"spider-man"}]});
});
app.get('/reservation', function(req,res,next){
    res.render('reservation.ejs');
});
app.get('/user',function(req,res,next){
    res.render('User_page.ejs')
})

https.createServer({
    key:fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);