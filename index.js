const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const signupService = require('./services/signup')
const passport = require('passport')

const app = express()

app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./config/passport/passport')
db.sequelize.sync({ force: true }).then(() => {
  signupService(app,db);
  app.listen(8080, () => {
    console.log("Server is running port 8080")
  })
})
