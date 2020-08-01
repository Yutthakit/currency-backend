const passport = require('passport')
const nodemailer = require('nodemailer');

module.exports = (app, db) => {

  app.put('/resetPassword/:userId', async (req, res, next) => {
    // try {
    //   console.log("111");
    //   const { params, body } = req
    //   const { userId } = params
    //   const { username, password} = body
    //   var salt = bcrypt.genSaltSync(BCRYPT_SATL_ROUNDS);
    //   console.log(salt);
    //   var hashedPassword = bcrypt.hashSync(password, salt)
    //   console.log(hashedPassword);
    //   const dataUser = {
    //     password: hashedPassword
    //   }
    //   const targetUser = await db.user.findOne({
    //     where: {
    //       id: userId,
    //       username
    //     }
    //   })
    //   await targetUser.update(dataUser)
    //   res.status(200).send({ message: 'OK' })
    // } catch (error) {
    //   res.status(400).send(error)
    // }

    passport.authenticate('repass', (err, user, info) => {
      if (err) {
        console.error(err)
      }
      if (info !== undefined) {
        console.error(info.message)
        res.status(400).send(info.message)
      } else {
        res.status(200).send({
          message: 'OK'
        })
      }
    })(req, res, next)

  })

  app.post('/sendLinkResetPassword', async (req, res) => {
    try {
      const { body } = req
      const { username } = body
      const result = await db.user.findOne({
        where: {
          username: username
        }
      })
      const { id: userId, email } = result
      console.log(userId)
      console.log(email)
      const linkResetPassword = `http://localhost:8080/resetPassword/${userId}`
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'otpresponse@gmail.com',
          pass: 'codecamp'
        }
      })
      var mailOptions = {
        from: 'otpresponse@gmail.com',
        to: `${email}`,
        subject: 'Reset Password',
        text: ` Click Linnk to reset : ${linkResetPassword}`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
      res.status(200).send({message: 'success'})
    } catch (error) {
      res.status(400).send(error)
    }
  })
}