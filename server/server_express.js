var express = require('express');
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express ()
var crypto = require("crypto");
var https = require("https");
var fs = require('fs');



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


app.get('/', function(req,res,next){
    res.render('home_page.ejs');
});

//login
app.get('/login', function(req,res,next){
    res.render('login_page.ejs');
});

app.post('/ident', function(req, res, next){
    var hash = crypto.createHash("md5").update(req.body.password).digest('hex');
    
});

app.get('/admin/add_movie', function(req,res,next){
    res.render('add_movie.ejs');
});
app.get('/admin/modify_movie', function(req,res,next){
    res.render('modify_movie.ejs');
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