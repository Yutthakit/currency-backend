const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const signupService = require('./services/signup')
const loginService = require('./services/login')
const passport = require('passport')
const cors = require('cors')
const app = express()

app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
require('./config/passport/passport')
db.sequelize.sync({ force : false }).then(() => {
  signupService(app, db);
  // loginService(app,db);

  app.get('/protected', passport.authenticate('jwt', { session: false }),

    (req, res) => {
      res.send(req.users)
    }

  )

  app.listen(8080, () => {
    console.log("Server is running port 8080")
  })
})
