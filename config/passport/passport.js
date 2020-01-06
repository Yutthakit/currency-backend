const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env];

const bcrypt = require('bcryptjs')

const BCRYPT_SATL_ROUNDS = config.satl_length

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy
const extractjwt = require('passport-jwt').ExtractJwt
const db = require('../../models')

let jwtOption = {}
jwtOption.secretOrKey = 'c0d3c4mp4'

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
        console.log('Email already taken')
        return done(null, false, { message: 'Email already taken' })
      } else {
        let salt = bcrypt.genSaltSync(BCRYPT_SATL_ROUNDS);
        let hashedPassword = bcrypt.hashSync(password, salt)
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