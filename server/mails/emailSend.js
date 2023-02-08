import nodemailer from 'nodemailer'
var email;
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: 'Your email',
      pass: 'your password',
    }
});


