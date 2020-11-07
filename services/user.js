const passport = require('passport')
const jwt = require('jsonwebtoken')
const jwtOptions = require('../config/passport/passport')
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 4000000
  }
});

module.exports = (app, db) => {
  app.post('/register', async (req, res, next) => {
    try {
      const {
        body
      } = req
      console.log(body)
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
          res.status(403).send({
            message: err.message
          })
        } else {
          const targetUser = await db.user.findOne({
            where: {
              username: req.body.username
            }
          })
          await targetUser.update({
            name,
            surname,
            tel,
            birth_date: Date(birth_date),
            gender,
            email
          })
        }
      })(req, res, next)
      res.status(200).send({
        message: 'OK'
      })
    } catch (error) {
      res.status(400).send({
        message: 'Error'
      })
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
        const token = jwt.sign({
          id: user.id,
          name: user.name,
          role: user.role
        }, jwtOptions.secretOrKey, {
          expiresIn: 3600
        })
        res.status(200).send({
          auth: true,
          token,
          message: 'User found logged In'
        })
      }
    })(req, res, next)
  })

  app.get('/protected-route', passport.authenticate('jwt', {
      session: false
    }),
    function (req, res) {
      res.status(200).send(req.user)
    }
  )

  app.get('/profile', passport.authenticate('jwt', {
    session: false
  }), async (req, res) => {
    try {
      const {
        user
      } = req
      const {
        id: userId
      } = user
      const result = await db.user.findOne({
        where: {
          id: userId
        }
      })
      res.status(200).send(result);
    } catch (error) {
      res.status(401).send({
        message: error
      })
    }
  })

  app.put('/profile', passport.authenticate('jwt', {
    session: false
  }), async (req, res) => {
    try {
      const {
        user,
        body
      } = req
      const {
        id: userId
      } = user
      const {
        name,
        surname,
        tel
      } = body
      const dataUser = {
        name,
        surname,
        tel
      }
      const targetUser = await db.user.findOne({
        where: {
          id: userId
        }
      })

      await targetUser.update(dataUser)
      res.status(200).send({
        message: 'Success'
      })

    } catch (error) {

      res.status(400).send({
        message: error
      })
    }
  })

  app.post('/upload-image', upload.single('avatar'), passport.authenticate('jwt', {
      session: false
    }),
    async (req, res) => {
      const {
        file
      } = req
      const {
        fieldname,
        originalname,
        encoding,
        mimetype,
        size,
      } = file
      console.log(        fieldname,
        originalname,
        encoding,
        mimetype,
        size)
    })
}