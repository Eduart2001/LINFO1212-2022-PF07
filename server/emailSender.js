const QRCode = require("./server_express").QRCode;
const transporter = require("./server_express").transporter;

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