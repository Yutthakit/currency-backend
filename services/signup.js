const passport = require('passport')
const jwt = require('jsonwebtoken')
const jwtOptions = require('../config/passport/passport')

module.exports = (app, db) => {
  app.post('/signup', (req, res, next) => {
    console.log("user")
    passport.authenticate('register', (err, user, info) => {
      if (err) {
        console.error(err.message);
      }
      if (info) {
        console.error(info.message)
        res.status(403).send({ message: err.message })
      } else {
        console.log("read data")
        const data = ({
          username: user.username,
          name: req.body.name,
          surname: req.body.surname,
          tel: req.body.tel,
          birth_date: req.body.birth_date,
          gender: req.body.gender,
          user_id: Math.floor(10000000 + Math.random() * 90000000),
          role: "user"
        });
        console.log(req.body.name)
        db.user.findOne({
          where: { username: data.username }
        })
          .then(user => {
            user.update({
              name: data.name,
              surname: data.surname,
              tel: data.tel,
              birth_date: data.birth_date,
              gender: data.gender,
              user_id: data.user_id,
              role: data.role
            })
              .then(() => {
                console.log('user create in db')
                res.status(200).send({ message: 'user create' })
              })
              .catch(err => {
                console.error(err)
                res.status(400).send({ message: err.message })
              })
          })
          .catch(err => {
            console.error(err)
            res.status(400).send({ message: err.message })
          })
      }
    })(req, res, next)
  })

  app.post('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) {
        console.error(ree)
      }
      if (info !== undefined) {
        console.error(info.message)
        res.status(400).send(info.message)
      } else {
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, jwtOptions.secretOrKey, { expiresIn: 3600 })
        res.status(200).send({
          auth: true,
          token,
          message: 'User found logged In'
        })
      }
    })(req, res, next)
  })

  app.get('/protected-route', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      res.status(200).send(req.user)
    }
  )
}

