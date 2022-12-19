var express = require("express");
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var https = require("https");
var fs = require("fs");
var multer = require("multer");
var request = require("request");
var nodemailer = require("nodemailer");
var QRCode = require("qrcode");
var app = express ();


app.set("view engine", "ejs");

app.set("public", path.join(__dirname, "../static/css"));
app.set("views", path.join(__dirname, "../static/templates"));
app.use(express.static(path.join(__dirname, "../static")));
app.use("/css", express.static(path.join(__dirname, "'../static/css")));
app.use(bodyParser.json())
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
const Movie = require("../Database/Movie");
const TimeTable = require("../Database/TimeTable");
const Seat = require("../Database/Seat");

User.sync().then(() => {login.emptyUsersDB()})
Movie.sync().then(() => {movie.emptyMoviesDB()})
Hall.sync().then(() => {hall.create3Halls()})
TimeTable.sync().then(() => {console.log("TimeTable")})
Seat.sync().then(() => {console.log("seat")})
//sequelize.sync().then(() => {login.emptyUsersDB(), movie.emptyMoviesDB(), console.log("db is ready")});


//multer options
const storage = multer.diskStorage({
    destination: './static/Posters/',
    filename: function (req, file, cb){
        cb(null, movie.replaceInvalid(req.body.movieName) + "." + file.originalname.split(".")[1]);
    }
});

//nodemailer options
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: 'climax.louvainlaneuve@gmail.com',
        pass: 'mfnbeautsooqukcy'
    }
});

const upload = multer({storage:storage});

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
    request: request,
    upload : upload,
    QRCode: QRCode,
    transporter: transporter
};

//imports
const login = require("./login");
const movie = require("./movie");
const hall = require("./hall");
const timeTable = require("./timeTable");
const emailSender = require("./emailSender");
const { time } = require("console");

app.get('/', async function(req,res,next){
    if (req.session.email){
        res.render('home_page.ejs',{linkName: (await login.getName(req.session.email)).split(" ")[0], link:"/user", movies:await movie.getAllMovies()});
    } else {
        res.render('home_page.ejs',{linkName:"Login", link:"/login", movies:await movie.getAllMovies()});
    }
});

app.post('/ticket', function (req, res, next){
    if (req.session.email){
        emailSender.sendTicket(req.session.email, 5, "D15", "Avatar", "2022-12-23", "15:00");
        res.send('email sent');
    } else{
        res.redirect("/login");
    }
});

app.get('/movie', async function(req, res, next){
    let result = await movie.getMovieById(req.query.id);
    if (!result.length > 0){
        res.send(`Movie with such id does not exist`);
    } else {
        if (req.session.email){
            res.render('movie_page.ejs', {linkName: (await login.getName(req.session.email)).split(" ")[0], link:"/user", movieName: result[0].movieName, ageRestriction: "../age_ratings/" + result[0].ageRestriction + ".png", actors: result[0].actors, directors: result[0].directors, genre: result[0].genre, duration: result[0].duration, country: result[0].country, releaseDate: result[0].releaseDate.split(" ")[0], IMDBscore: result[0].IMDBscore, description: result[0].description, poster: "../Posters/" + result[0].poster, trailerURL: 'https://www.youtube.com/embed/' + result[0].trailerURL.split("v=")[1].split("&")[0]});
        } else {
            res.render('movie_page.ejs', {linkName:"Login", link:"/login", movieName: result[0].movieName, ageRestriction: "../age_ratings/" + result[0].ageRestriction + ".png", actors: result[0].actors, directors: result[0].directors, genre: result[0].genre, duration: result[0].duration, country: result[0].country, releaseDate: result[0].releaseDate.split(" ")[0], IMDBscore: result[0].IMDBscore, description: result[0].description, poster: "../Posters/" + result[0].poster, trailerURL: 'https://www.youtube.com/embed/' + result[0].trailerURL.split("v=")[1].split("&")[0]});
        }
    }
});


//login
app.get("/login", function (req, res, next) {
    if (req.query.incorrect) {
        res.render('login_page.ejs', {incorrect: "The username or the password you entered was incorrect"});
    } else {
        res.render("login_page.ejs", {incorrect: ""});
    }
});

app.post('/ident', async function(req, res, next){
    var hash = crypto.createHash("md5").update(req.body.password).digest('hex');
    let result = await login.login(req.body.email.toLowerCase(), hash);
    if (result == req.body.email.toLowerCase()){
        req.session.email = result;
        req.session.admin = await login.isAdmin(req.session.email);
        res.redirect('/');
    } else res.redirect('/login?incorrect=true');
});

app.post('/logOut', function (req, res, next){
    req.session.email = "";
    req.session.admin = false;
    res.redirect("/");
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

app.get('/user',function(req,res,next){
    if (req.session.email){
        if (req.session.admin){
            res.render('User_page.ejs', {admincheck: true});
        }
        else {
            res.render('User_page.ejs', {admincheck:false});
        }
 
    } else{ 
        res.redirect("/login");
    }
});

app.post('/personalChange', function(req, res, next) {
    const NewName = req.body.name;
    const NewBday = req.body.bday;
    const NewNumber = req.body.number;
  
    if (NewName) {
      User.update(
        { name: NewName },
        { where: { email: req.session.email } }
      )
        .then(() => console.log("Name has been changed!"))
        .catch((error) => console.error(error));
    }
    if (NewBday) {
      User.update(
        { birthdate: NewBday },
        { where: { email: req.session.email } }
      )
        .then(() => console.log("Birthday has been changed!"))
        .catch((error) => console.error(error));
    }
    if (NewNumber) {
      User.update(
        { phoneNumber: NewNumber },
        { where: { email: req.session.email } }
      )
        .then(() => console.log("Number has been changed!"))
        .catch((error) => console.error(error));
    }
  
    res.redirect("/user");
  });
  

app.post('/email_change',function(req,res,next){
    const NewEmail=new String(req.body.new_email).toLowerCase();
    const OldEmailGiven=new String(req.body.old_email).toLowerCase();

    if(OldEmailGiven!=req.session.email){
        console.log("This is not the correct email used before!");
        res.redirect('/user');
    }

    else if (OldEmailGiven===NewEmail){
        console.log("Your new email can't be the same as the old email!");
        res.redirect('/user');
    }
    
    else{
        User.update(
            {email:NewEmail},
            {where:{email:OldEmailGiven}}
        )
        .then(() =>{
            req.session.email=NewEmail;
            res.redirect('/user')
            console.log("Email has been changed!")
        })
    }

})

app.get("/reservation", function (req, res, next) {
    res.render("reservation.ejs");
});


//admin part
app.get("/admin/add_movie", function (req, res, next) {
    if (req.session.email){
        if (req.session.admin){
            res.render("add_movie.ejs");
        } else{
            res.send("You are not an admin, you are not allowed to enter this page");
        }
    } else{
        res.redirect("/login");
    }
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

app.post("/add/movie/to/timetable", async function (req, res, next) {
    let movieId = req.body.movieSelector;
    let datePicker = Number(req.body.radioChecker);

    var object ={
    hallId:Number(req.body.hallSelector),
    movieId:Number(movieId.split("id-").at(-1)),
    time:Math.floor((datePicker/7)),
    day:(datePicker%7==0)?7:datePicker%7 
    }

    timeTable.add(object)
    res.redirect("/admin/time_table");
});

app.get("/admin/modify_movie", async function (req, res, next) {
    if (req.session.email){
        if (req.session.admin){
            let result = await sequelize.query(`SELECT * FROM Movies`);
            console.log(result[0]);
            res.render("modify_movie.ejs", { data: { movies: result[0] } });
        } else{
            res.send("You are not an admin, you are not allowed to enter this page");
        }
    } else{
        res.redirect("/login");
    }
});

app.get("/admin/time_table",async function (req, res, next) {
    if (req.session.email){
        if (req.session.admin){
            const queryResultMovies = await movie.getAllMovies();
            const queryResultHalls = await hall.getAllHalls();
                            
            res.render("time_table.ejs",{movies:queryResultMovies,halls:queryResultHalls});
        } else{
            res.send("You are not an admin, you are not allowed to enter this page");
        }
    } else{
        res.redirect("/login");
    }
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

app.post('/hall/timetable/get', async function (req, res, next) {
    let id = req.query.id;
    let queryResult = await timeTable.getTimeTable(id)
    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify(queryResult);
    console.log(result)
    res.end(result);
});

// end admin part 

https.createServer({
    key:fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);