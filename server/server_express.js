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
const MovieReserved =require("../Database/MovieReserved");

User.sync().then(() => {login.emptyUsersDB()})
Movie.sync().then(() => {movie.emptyMoviesDB()})
Hall.sync().then(() => {hall.create3Halls()})
TimeTable.sync().then(() => {timeTable.emptyTimeTableDB()})
Seat.sync().then(() => {seat.emptyTimeTableDB()})
MovieReserved.sync().then(() => {moviereserved.emptyReservationDB()})
sequelize.sync().then(() => {console.log("db is ready")});

//multer options
const storage = multer.diskStorage({
    destination: './static/Posters/',
    filename: function (req, file, cb){
        cb(null, movie.replaceInvalid(req.body.movieName) + "." + file.originalname.split(".")[1]);
    }
});
const upload = multer({storage:storage});

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

// exports variables
module.exports = {
    app: app,
    sequelize: sequelize,
    User: User,
    Hall: Hall,
    TimeTable: TimeTable,
    Movie: Movie,
    Seat: Seat,
    MovieReserved:MovieReserved,
    fs: fs,
    request: request,
    //upload : upload,
    QRCode: QRCode,
    transporter: transporter,
    // server:server
};


//imports
const login = require("./login");
const movie = require("./movie");
const hall = require("./hall");
const timeTable = require("./timeTable");
const emailSender = require("./emailSender");
const { time } = require("console");
const seat = require("./seat");
const moviereserved=require("./moviereserved");

app.get('/', async function(req,res,next){
    if (!req.session.search) {
        req.session.search = {};
      }
    if (req.session.email){
        res.render('home_page.ejs',{linkName: (await login.getName(req.session.email)).split(" ")[0], link:"/user", movies:await movie.getAllMovies(req.session.search.search),genres:await movie.getAllGenres(req.session.search.search)});
    } else {
        res.render('home_page.ejs',{linkName:"Login", link:"/login",  movies:await movie.getAllMovies(req.session.search.search),genres:await movie.getAllGenres(req.session.search.search)});
    }
});

app.post('/search', async function(req,res,next){
    req.session.search.search = req.body.searchbox;
    res.redirect('/');
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
            res.render('movie_page.ejs', {id: req.query.id, linkName: (await login.getName(req.session.email)).split(" ")[0], link:"/user", movieName: result[0].movieName, ageRestriction: "../age_ratings/" + result[0].ageRestriction + ".png", actors: result[0].actors, directors: result[0].directors, genre: result[0].genre, duration: result[0].duration, country: result[0].country, releaseDate: result[0].releaseDate.split(" ")[0], IMDBscore: result[0].IMDBscore, description: result[0].description, poster: "../Posters/" + result[0].poster, trailerURL: 'https://www.youtube.com/embed/' + result[0].trailerURL.split("v=")[1].split("&")[0]});
        } else {
            res.render('movie_page.ejs', {id: req.query.id, linkName:"Login", link:"/login", movieName: result[0].movieName, ageRestriction: "../age_ratings/" + result[0].ageRestriction + ".png", actors: result[0].actors, directors: result[0].directors, genre: result[0].genre, duration: result[0].duration, country: result[0].country, releaseDate: result[0].releaseDate.split(" ")[0], IMDBscore: result[0].IMDBscore, description: result[0].description, poster: "../Posters/" + result[0].poster, trailerURL: 'https://www.youtube.com/embed/' + result[0].trailerURL.split("v=")[1].split("&")[0]});
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

app.get("/forgotten", function (req, res, next) {
    res.render("forgotten.ejs");
});

app.post("/passRecover", async function (req, res, next) {
    await emailSender.recover(req.body.email.toLowerCase());
    res.redirect("/");
    // alert("An email with a new password has been sent");
});

app.get("/register", function (req, res, next) {
    res.render("register_page.ejs", { incorrect: "" });
});


//user
app.get('/user',async function(req,res,next){
    if (req.session.email){
        if (req.query.alert){
            if (req.session.admin){
                res.render('User_page.ejs', {admincheck: true,alerting:req.query.alert,reservs:await moviereserved.AllMovieUser(req.session.email)});
            }
            else {
                res.render('User_page.ejs', {admincheck: false,alerting:req.query.alert,reservs:await moviereserved.AllMovieUser(req.session.email)});
            }
        }
        else {
            if (req.session.admin){
                res.render('User_page.ejs', {admincheck: true,alerting:"",reservs:await moviereserved.AllMovieUser(req.session.email)});
            }
            else {
                res.render('User_page.ejs', {admincheck: false,alerting:"",reservs:await moviereserved.AllMovieUser(req.session.email)});
            }
        }

    } else{ 
        res.redirect("/login");
    }
});

//Post for the different forms of user
app.post('/personalChange', function(req, res, next) {
    const NewName = req.body.name;
    const NewBday = req.body.bday;
    const NewNumber = req.body.number;
  
    if (NewName) {
      User.update(
        { name: NewName },
        { where: { email: req.session.email } }
      )
        .then(() => {
            console.log("Name has been changed!");
            res.redirect("/user?alert=Information has been updated!");
        })
        .catch((error) => console.error(error));
    }
    if (NewBday) {
      User.update(
        { birthdate: NewBday },
        { where: { email: req.session.email } }
      )
        .then(() => {
            console.log("Birthday has been changed!");
            res.redirect("/user?alert=Information has been updated!");

        })
        .catch((error) => console.error(error));
    }
    if (NewNumber) {
      User.update(
        { phoneNumber: NewNumber },
        { where: { email: req.session.email } }
      )
        .then(() => {
            console.log("Number has been changed!");
            res.redirect("/user?alert=Information has been updated!");
        })
        .catch((error) => console.error(error));
    }
    if(!NewNumber&&!NewBday&&!NewName) {
        res.redirect("/user")
    }
    });
  

app.post('/email_change',function(req,res,next){
    const NewEmail=new String(req.body.new_email).toLowerCase();
    const OldEmailGiven=new String(req.body.old_email).toLowerCase();

    if(OldEmailGiven!=req.session.email){
        console.log("This is not the correct email used before!");
        res.redirect("/user?alert=This is not the correct email used before!")
    }

    else if (OldEmailGiven===NewEmail){
        console.log("Your new email can't be the same as the old email!");
        res.redirect("/user?alert=Your new email can't be the same as the old email");
    }
    
    else{
        User.update(
            {email:NewEmail},
            {where:{email:OldEmailGiven}}
        )
        .then(() =>{
            req.session.email=NewEmail;
            res.redirect('/user?alert=Email has been changed!')
            console.log("Email has been changed!")
        })
        .catch(()=>{
            console.error("Error")
        })
    }

})

app.post('/password_change', async function(req, res, next) {
    // Hash the passwords
    const oldPassword = crypto.createHash("md5").update(req.body.oldpassword).digest('hex');
    const newPassword = crypto.createHash("md5").update(req.body.newpassword).digest('hex');
    const passRep = crypto.createHash("md5").update(req.body.passwordrep).digest('hex');
  
    const [result] = await sequelize.query(`Select password From Users where email = '${req.session.email}'`);
    const realPass = result[0].password;
  
    if (oldPassword !== realPass) {
      console.log("Not the correct old password");
      res.redirect("/user?alert=Not the correct old password");
    } else if (req.body.oldpassword === req.body.newpassword) {
      console.log("Can't have the same password as the old password");
      const message = encodeURIComponent("Can't have the same password as the old password");
      res.redirect(`/user?alert=${message}`);
    } else if (newPassword !== passRep) {
      console.log("Retype password");
      res.redirect("/user?alert=Retype password");
    } else {
      // Update the password in the database
      await User.update(
        { password: newPassword },
        { where: { email: req.session.email } }
      );
  
      // Update the session password
      req.session.password = newPassword;
      res.redirect("/user?alert=Password has been changed!");
      console.log("Password has been changed!");
    }
  });
  
//End of the forms

//Delete reservations
app.post("/removeReserv", (req, res) => {
    console.log(req.body.title);
    console.log(req.body.hour);
    MovieReserved.destroy({
      where: {
        email: req.session.email,
        movieName: req.body.title,
        Hour: req.body.hour,
        Day: req.body.date,
        HallNumber: req.body.hall,
        SeatNumber: req.body.seat
      }
    })
      .then(() => {
        console.log("Reservation deleted");
        res.redirect("/user?alert=Reservation deleted");
      })
      .catch(err => {
        console.error(err);
        res.redirect("/user?alert=Reservation has not been deleted");
      });
  });
  
  



app.get("/movie/reservation", async function (req, res, next) {
    let result = await movie.getMovieById(req.query.id);
    if (!result.length > 0){
        res.send(`Movie with such id does not exist`);
    } else {
        var object={
            name: result[0].movieName,
            poster: "../Posters/" + result[0].poster,
            ageRestriction: "../age_ratings/" + result[0].ageRestriction + ".png",
            genre: result[0].genre,
            duration: result[0].duration,
            country: result[0].country,
            releaseDate: result[0].releaseDate.split(" ")[0],
            imdbscore: result[0].IMDBscore,
            description: result[0].description,
            actors:result[0].actors,
            directors:result[0].directors
        }
        res.render('reservation.ejs', {data:object});
    }
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
        poster: movie.replaceInvalid(body.movieName) + "." + req.file.originalname.split(".")[1],
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
app.post('/modified/movie', upload.single('upload'), async function(req, res, next){
    try{
        let body =await req.body
        await movie.updateMovieData(body)
        res.redirect("/admin/modify_movie");
    }catch{
        res.redirect("/admin/modify_movie");
    }
});


app.post("/add/movie/to/timetable", async function (req, res, next) {
    let movieId = req.body.movieSelector;
    let datePicker =req.body.radioChecker;
    datePicker=Number(datePicker.split(" ").at(-1))
    var object ={
    hallId:Number(req.body.hallSelector),
    movieId:Number(movieId.split("id-").at(-1)),
    time:Math.floor((datePicker/7)),
    day:(datePicker%7==0)?7:datePicker%7 
    }

    timeTable.add(object)
    res.redirect("/admin/time_table");
});

app.post("/reservation/done", async function (req, res, next) {
    function getNearestDateWithDayNumber(dayNumber) {
        const today = new Date();
        const todayDayNumber = today.getDay();
        const daysUntilDay = (dayNumber - todayDayNumber) % 7;
        const nearestDate = new Date(today.getTime() + daysUntilDay * 24 * 60 * 60 * 1000);
        return nearestDate.toLocaleDateString('fr-CA');
    }

    let table = (req.body.session).split("-");
    let seats = req.body.selectedSeat;
    let email;
    let connected=false;
    let price=12.50;
    if(req.session.email){
        email=req.session.email;
        connected=true;
    }else{
        email=req.body.email;
    }

    if(typeof(seats)==="string"){
        Seat.create({
            id:seats,
            timeTableId:req.body.session,
        })
        MovieReserved.create({
            email:email,
            movieName: (await movie.getMovieName(table[1])).movieName,
            HallNumber:table[0],
            SeatNumber:seats,
            Day:table[2],
            Hour:table[3]
        })
        
    }else{
        for(let x =0; x <seats.length;x++){
            Seat.create({
                id:seats[x],
                timeTableId:req.body.session,
            })
            MovieReserved.create({
                email:email,
                movieName: (await movie.getMovieName(table[1])).movieName,
                HallNumber:table[0],
                SeatNumber:seats[x],
                Day:table[2],
                Hour:table[3]
            })
        }
        price*=seats.length
    }
    if(connected){
        await emailSender.sendTicket(email,(await login.getPublicData()).name, price, table[0], seats, (await movie.getMovieName(table[1])).movieName, getNearestDateWithDayNumber(table[2]), table[3])
    }else{
        await emailSender.sendTicket(email,req.body.first + " "+ req.body.last, price, table[0], seats, (await movie.getMovieName(table[1])).movieName, getNearestDateWithDayNumber(table[2]), table[3])
    }
    res.redirect("/");

});

app.get("/admin/modify_movie", async function (req, res, next) {
    if (req.session.email){
        if (req.session.admin){
            let result = await sequelize.query(`SELECT * FROM Movies`);
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

app.post('/movie/reservation/getData', async function (req, res, next) {
    if (req.session.email){
        userResult = await login.getPublicData(req.session.email);
    } else {
        var userResult=[];
    }
    timeTableResult= await timeTable.getTimeTableByMovie(req.query.id);
    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify([userResult[0],timeTableResult]);
    res.end(result);
});

app.post('/movie/reservation/getSeats', async function (req, res, next) {
    var queryResult=req.query.id
    bookedSeats= await seat.getReservedSeatsForTimeTable(queryResult);
    hallCapacity= await hall.getHallCapacity(queryResult.split("-").at(0));
    res.setHeader("Content-Type", "application/json");
    let result = JSON.stringify([hallCapacity[0],bookedSeats]);
    res.end(result);
});

app.post('/admin/modify_movie/remove', async function (req, res, next) {
    var queryResult=req.query.id
    await movie.removeDeletedMoviePoster(queryResult).then(()=>{console.log("Done")});
    await movie.deleteMovie(queryResult).then(()=>{console.log("Done")});
    res.redirect("/admin/add_movie")
});
// end admin part


const server =https.createServer({
    key:fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);

process.on('exit', () => {
    server.close();
});

module.exports={
    server:server
}