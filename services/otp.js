const passport = require('passport')
const nodemailer = require('nodemailer');

module.exports = (app, db) => {

  app.post('/send-otp', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      db.number_otp.create({
        number_otp: Math.floor(1000 + Math.random() * 9000),
        user_id: req.user.id
      })
        .then((result) => {
          res.status(200).send(result)
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });
    }
  )
}

    // async (req, res) => {
    //   // const sendOtp = await db.credit_card.findOne({
    //   //   where: { user_id: req.user.id }
    //   // })
    //   // if (sendOtp !== null) {
    //   //   db.otp.create({
    //   //     number_otp: Math.floor(1000 + Math.random() * 9000),
    //   //     user_id: req.user.id
    //   //   })
    //   // } else {
    //   //   res.status(400).send({ message: "Error" })
    //   // }
    //   db.otp.create({
    //     number_otp: Math.floor(1000 + Math.random() * 9000),
    //     user_id: req.user.id
    //   })
    //   console.log(number_otp)
    // }

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'otpresponse@gmail.com',
  //     pass: 'codecamp'
  //   }
  // })
  // var mailOptions = {
  //   from: 'otpresponse@gmail.com',
  //   to: 'yutakittha@gmail.com',
  //   subject: 'Sending Email using Node.js',
  //   text: 'That was easy!'
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // })
