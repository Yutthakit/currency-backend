const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env];

const bcrypt = require('bcryptjs')

const BCRYPT_SATL_ROUNDS = config.satl_length

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy
const extractjwt = require('passport-jwt').ExtractJwt
const db = require('../../models')

let jwtOptions = {}
jwtOptions.secretOrKey = 'c0d3c4mp4'

passport.use('register', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
  },
  (username, password, done) => {
    db.user.findOne({
      where: { username: username }
    }).then(user => {
      if (user !== null) {
        console.log('ID already taken')
        return done(null, false, { message: 'ID already taken' })
      } else {
        var salt = bcrypt.genSaltSync(BCRYPT_SATL_ROUNDS);
        var hashedPassword = bcrypt.hashSync(password, salt)
        db.user.create({ username, password: hashedPassword })
          .then(user => {
            console.log('user create')
            return done(null, user)
          })
          .catch(err => {
            console.error(err)
            done(err)
          })
      }
    })
  }
))

passport.use('login', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
  }, async (username, password, done) => {
    let user = await db.user.findOne({
      where: { username }
    })
    if (user === null) {
      return done(null, false, { message: 'username or password is incorrect' })
    }
    bcrypt.compare(password, user.password, (err, response) => {
      if (err) {
        console.error(err)
        done(err)
      }
      if (!response) {
        return done(null, false, { message: 'username or password is incorrect' })
      }
      console.log(`user ${user.id} is found & authenticated`)
      return done(null, user)
    }
    )
  }

))

passport.use('repass', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
  }, async (username, password, done) => {
    let user = await db.user.findOne({
      where: { username }
    })
    if (user === null) {
      return done(null, false, { message: 'username dose not exist in db' })
    }
    var salt = bcrypt.genSaltSync(BCRYPT_SATL_ROUNDS);
    var hashedPassword = bcrypt.hashSync(password, salt)
    const dataUser = {
      password: hashedPassword
    }
    const targetUser = await db.user.findOne({
      where: { username }
    })
    await targetUser.update(dataUser)
    return done(null, user)
  }
))

const opts = {
  jwtFromRequest: extractjwt.fromAuthHeaderAsBearerToken(), secretOrKey: jwtOptions.secretOrKey
}

passport.use('jwt', new jwtStrategy(opts, (jwt_payload, done) => {
  db.user.findOne({ where: { id: jwt_payload.id } })
    .then(user => {
      if (user) {
        console.log("user found")
        done(null, user)
      } else {
        console.log("user is not found")
        done(null, false)
      }
    })
}))



module.exports = jwtOptions