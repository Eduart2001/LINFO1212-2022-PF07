var express = require('express');
var app = express ()
var path = require("path");

app.set('view engine', 'ejs');

app.set('public', path.join(__dirname, '../static/css'));
app.set('views', path.join(__dirname, '../static/templates'));
app.use(express.static(path.join(__dirname, '../static')));
app.use("/css",express.static(path.join(__dirname, "'../static/css")))


app.get('/', function(req,res,next){
    res.render('home_page.ejs');
});

app.get('/login', function(req,res,next){
    res.render('login.ejs');
});

app.post('/admin/add_movie', function(req,res,next){
    res.render('add_movie.ejs');
});
app.get('/admin/modify_movie', function(req,res,next){
    res.render('modify_movie.ejs');
});
app.get('/reservation', function(req,res,next){
    res.render('reservation.ejs');
});

app.listen(8080);