const QRCode = require("./server_express").QRCode;
const transporter = require("./server_express").transporter;
const User = require("./server_express").User;
const sequelize = require("./server_express").sequelize;
var crypto = require("crypto");

/**
 * Checks if the email given corresponds to an admin account, returns true or false.
 *
 * @param {String} email The email of the user who will receive the ticket.
 */
async function recover(email){
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-=+";
    var newpassword = "";

    for (let i = 0; i < 8; i++){
        newpassword += characters[Math.floor(Math.random() * characters.length)];
    }

    User.update({password: crypto.createHash("md5").update(newpassword).digest('hex')}, {where: {email:email}});

    var mailOptions = {
        from: 'climax.louvainlaneuve@gmail.com',
        to: email,
        subject: "Password changed",
        text: "Password has been changed",
        html: 'Find bellow your new password, however you can change it in your personal area <br> <h1>' + newpassword + '</h1>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    console.log(newpassword);
}

/**
 * Checks if the email given corresponds to an admin account, returns true or false.
 *
 * @param {String} receiver The email of the user who will receive the ticket.
 * @param {String} hall where the movie will be played.
 * @param {String} seat reserved for the client.
 * @param {String} movie which the client is going to watch.
 * @param {String} date of the show.
 * @param {String} time when the movie will be played.
 */
function sendTicket(receiver, hall, seat, movie, date, time){
    let data = {
        hall: hall,
        seat: seat,
        movie: movie,
        date: date,
        time: time
    };

    // Converting the data into String format
    let stringData = JSON.stringify(data);
    
    // Converting the data into base64
    QRCode.toDataURL(stringData, function (err, QRcode) {
        if (err) return console.log("error occurred");

        var mailOptions = {
            from: 'climax.louvainlaneuve@gmail.com',
            to: receiver,
            subject: "Ticket purchased",
            attachDataUrls: true,
            text: "Congrats",
            html: 'Find bellow your QR code ticket <br> <img src="' + QRcode + '">'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error){
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // Printing the code
        console.log(QRcode);
    });

    // Print the QR code to terminal
    QRCode.toString(stringData,{type:'terminal'}, function (err, QRcode) {
        if(err) return console.log("error occurred");
     
        // Printing the generated code
        console.log(QRcode);
    })
}

exports.sendTicket = sendTicket;
exports.recover = recover;