const passport = require('passport')

module.exports = (app, db) => {
  app.post('/signup', async (req, res) => {
    try {
      const result = await db.post.create({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        tel: req.body.tel,
        birth_date: req.body.birth_date,
        password: req.body.password,
        gender: req.body.gender,
        user_id: Math.floor(10000000 + Math.random() * 90000000) //ถ้า random มาซ้ำหละ
      })
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  })
}


module.exports = (app, db) => {
  app.post('/signup', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info) {
        console.error(info.message)
        res.status(403).send({ message: err.message })
      } else {
        const data = {
          email: user.email,
          name: req.body.name,
          surname: req.body.surname,
          tel: req.body.tel,
          birth_date: req.body.birth_date,
          gender: "Male",
          user_id: Math.floor(10000000 + Math.random() * 90000000),
          role: "user"
        };
        db.user.findOne({
          where: { email: email }
        })
          .then(user => {
            user.update({
              name: data.name,
              surname: data.surname,
              tel : data.tel,
              birth_date : data.birth_date,
              gender : data.gender,
              user_id : data.user_id,
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
}

