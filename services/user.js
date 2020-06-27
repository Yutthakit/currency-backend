const passport = require('passport')
const jwt = require('jsonwebtoken')
const jwtOptions = require('../config/passport/passport')
const bodyParser = require('body-parser')

module.exports = (app, db) => {
  app.post('/register', async (req, res, next) => {
    try {
      const { body } = req
      const {
        name,
        surname,
        email,
        gender,
        birth_date,
        tel
      } = body

      await passport.authenticate('register', async (err, user, info) => {
        if (err) {
          console.error(err.message);
        }
        if (info) {
          console.error(info.message)
          res.status(403).send({ message: err.message })
        }
        else {
          const userTarget = await db.user.findOne({
            where: { username: req.body.username }
          })
          console.log(userTarget)
          await userTarget.update({
            name,
            surname,
            tel,
            birth_date: Date(birth_date),
            gender,
            email
          })
        }
      })(req, res, next)
      res.status(200).send({ message: 'OK' })
    } catch (error) {
      res.status(400).send({ message: 'Error' })
    }
  })

  app.post('/login', (req, res, next) => {

    passport.authenticate('login', (err, user, info) => {
      if (err) {
        console.error(err)
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

  app.get('/user/:userId', async (req, res) => {

    const { userId } = req.params
    const result = await db.user.findAll({
      where: {
        id: userId
      }
    })
    res.json(result);
  })

  app.put('resetPassword', async (req, res) => {

  })

  app.put('/user/:userId', async (req, res) => {
    const { params, body } = req
    const { userId } = params
    const {
      name,
      surname,
      tel,
      birth_date,
      gender,
      email,
    } = body

    const dataUser = {
      name,
      surname,
      tel,
      birth_date,
      gender,
      email,
    }

    try {
      const targetUser = await db.user.findOne({
        where: {
          id: userId
        }
      })

      await targetUser.update(dataUser)

      console.log("111")
      res.status(200).send({ message: 'Success' })
    } catch (error) {
      res.status(400).send({ message: error })
    }
  })
}