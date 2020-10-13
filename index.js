require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const passport = require('passport')
const cors = require('cors')
const userService = require('./services/user')
const creditCardService = require('./services/credit_card')
const transactionService = require('./services/transaction')
const otpService = require('./services/otp')
const profitlossService = require('./services/profitloss')
const forgetPasswordService = require('./services/forgetPassword')
const staticService = require('./services/static')
const app = express()


app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
require('./config/passport/passport')
db.sequelize.sync({ alter: true }).then(() => {

  creditCardService(app, db)
  userService(app, db)
  otpService(app, db)
  transactionService(app, db)
  profitlossService(app, db)
  forgetPasswordService(app, db)
  staticService(app)
  app.get('/protected', passport.authenticate('jwt', { session: false }),

    (req, res) => {
      res.send(req.users)
    }

  )

  app.listen(8080, () => {
    console.log("Server is running port 8080")
  })
})
