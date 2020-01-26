const passport = require('passport')
const nodemailer = require('nodemailer');
const moment = require('moment')

module.exports = (app, db) => {

  app.post('/send-otp', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      db.number_otp.create({
        number_otp: Math.floor(1000 + Math.random() * 9000),
        user_id: req.user.id
      })
        .then(async (result) => {
          let tagetUser = await db.user.findOne({ where: { id: req.user.id } })
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'otpresponse@gmail.com',
              pass: 'codecamp'
            }
          })
          var mailOptions = {
            from: 'otpresponse@gmail.com',
            to: `${tagetUser.email}`,
            subject: 'Verifly Credit Card',
            text: ` OTP : ${result.number_otp}`
          };
          console.log(result.number_otp)
          console.log(tagetUser.email)
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
          res.status(200).send(result)
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });
    }
  )

  app.get('/verify-otp', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const requestVerify = await req.body.otp
      console.log(req.user.id)
      const targetOtp = await db.number_otp.findOne({ where: { user_id: req.user.id } })
      console.log(targetOtp)
      if (!targetOtp && requestVerify != targetOtp.number_otp) {
        res.status(400).send({ message: " OTP is incorrect" })
      } else {
        console.log(process.env.OTP_MINUTES_EXPIRSED)
        if ((moment(targetOtp.createdAt).diff(moment(), 'minutes')) > (-process.env.OTP_MINUTES_EXPIRSED)) {
          let addBalance = await db.user.findOne({ where: { id: req.user.id } })
          addBalance.update({
            Balance: req.body.amount
          })
          targetOtp.destroy()
          res.status(200).send({ message: 'Verifly success' })
        } else {
          res.status(400).send({ message: 'OTP is exprise' })
        }
      }
      const ms = moment(targetOtp.createdAt).diff(moment(), 'minutes')
      console.log(requestVerify)
      console.log(targetOtp.number_otp)
      console.log(ms)
    }
  )


}