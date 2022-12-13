var express = require("express");
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var https = require("https");
var fs = require("fs");
var multer = require("multer");
var request = require('request');
var app = express ()


app.set("view engine", "ejs");

app.set("public", path.join(__dirname, "../static/css"));
app.set("views", path.join(__dirname, "../static/templates"));
app.use(express.static(path.join(__dirname, "../static")));
app.use("/css", express.static(path.join(__dirname, "'../static/css")));

app.use(bodyParser.urlencoded({ extended: true }));
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
sequelize.sync().then(() => {login.emptyUsersDB(), movie.emptyMoviesDB(), console.log("db is ready")});

// exports variables
module.exports = {
    app: app,
    sequelize: sequelize,
    User: User,
    Hall: Hall,
    TimeTable: TimeTable,
    Movie: Movie,
    Seat: Seat,
    fs: fs,
    request: request
};

//imports
const login = require("./login");
const index = require("../static/script/script-index");
const movie = require("./movie");
const hall = require("./hall");
const timeTable = require("./timeTable");

//multer options
const storage = multer.diskStorage({
    destination: './static/Posters/',
    filename: function (req, file, cb){
        cb(null, movie.replaceInvalid(req.body.movieName) + "." + file.originalname.split(".")[1]);
    }
});
const upload = multer({storage:storage});
exports.upload = upload;

app.get('/test_add', function(req,res,next){
    res.render('test.ejs');
});
app.post('/test', upload.single("myFile"), function(req, res, next){
    console.log(req.body);
    console.log(req.file);
    res.send(`ok`);
});

app.get('/', async function(req,res,next){
    res.render('home_page.ejs',await index.add_movies_test);
});

app.get('/movie', async function(req, res, next){
    let result = await movie.getMovieById(req.query.id);
    if (!result.length > 0){
        res.send(`Movie with such id does not exist`);
    } else {
        res.render('movie_page.ejs', {movieName: result[0].movieName, actors: result[0].actors, directors: result[0].directors, genre: result[0].genre, duration: result[0].duration, country: result[0].country, releaseDate: result[0].releaseDate.split(" ")[0], IMDBscore: result[0].IMDBscore, description: result[0].description, poster: "../Posters/" + result[0].poster, trailerURL: 'https://www.youtube.com/embed/' + result[0].trailerURL.split("v=")[1].split("&")[0]});
    }
});


//login
app.get("/login", function (req, res, next) {
  // req.query.username = "";
    if (req.query.incorrect) {
        res.render('login_page.ejs', {incorrect: "The username or the password you entered was incorrect"});
    } else {
        res.render("login_page.ejs", {incorrect: ""});
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

app.get("/register", function (req, res, next) {
    res.render("register_page.ejs", { incorrect: "" });
});


//admin part
app.get("/admin/add_movie", function (req, res, next) {
    res.render("add_movie.ejs");
});

app.post('/add', upload.single('upload'), async function(req, res, next){
    let body =await req.body
    Movie.create({
        movieName:body.movieName,
        poster: movie.replaceInvalid(body.movieName) + "." + file.originalname.split(".")[1],
        description:body.description,
        actors:body.actors,
        directors:body.directors,
        releaseDate:body.date,
        trailerURL:body.trailerURL,
        country:body.country,
        ageRestriction:body.age,
        IMDBscore:body.imdb,
        genre:body.genre,
        duration:body.duration
    })
    res.redirect("/");
});

app.get('/user',function(req,res,next){
    res.render('User_page.ejs')
});

app.post("/add/movie/to/timetable", async function (req, res, next) {
    let movieId =req.body.movieSelector
    var object ={
    TimeTableId:1,
    hall:Number(req.body.hallSelector),
    movieId:Number(movieId.split("id-").at(-1)),
    time:Math.floor(Number(req.body.radioChecker)/10),
    day:Number(req.body.radioChecker)%10
}
//ca ne marche pas jsp pq
    TimeTable.create(object)

    res.redirect("/admin/time_table");
});
app.get("/admin/modify_movie", async function (req, res, next) {
    let result = await sequelize.query(`SELECT * FROM Movies`);
    console.log(result[0] )
    res.render("modify_movie.ejs", { data: { movies: result[0] } });
});

app.get("/admin/time_table",async function (req, res, next) {
    const queryResultMovies = await movie.getAllMovies();
    const queryResultHalls =await hall.getAllHalls();
                    
    res.render("time_table.ejs",{movies:queryResultMovies,halls:queryResultHalls});

});



//HTTP requests through js

app.get("/movie/get", async function (req, res, next) {
    let id = req.query.id;
    let queryResult = await movie.getMovieById(id)

    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify(queryResult[0]);
    res.end(result);
});

app.get("/admin/get_all_movies", async function (req, res, next) {
    let queryResult = movie.getAllMovies();

    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify(queryResult);
    res.end(result);
});

app.get("/hall/timeTable/get", async function (req, res, next) {
    let id = req.query.id;
    let queryResult = await timeTable.getTimeTableById(id)
    //console.log(queryResult)
    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify(queryResult[0]);
    res.end(result);
});


// end admin part 
app.get("/reservation", function (req, res, next) {
    res.render("reservation.ejs");
});

app.get("/user", function (req, res, next) {
    res.render("User_page.ejs");
});

https.createServer({
    key:fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);