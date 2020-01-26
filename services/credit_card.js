const passport = require('passport')

const jwt = require('jsonwebtoken')
const jwtOptions = require('../config/passport/passport')

module.exports = (app, db) => {

  app.post('/add-credit-card', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      db.credit_card.create({
        user_id: req.user.id,
        card_name: req.body.card_name,
        card_no: req.body.card_no,
        valid_month: req.body.valid_month,
        valid_year: req.body.valid_year
      })
        .then((result) => {
          res.status(200).send(result)
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });
    }
  )






  // app.post('/add-credit-card', passport.authenticate('jwt', { session: false }),
  //   (req, res) => {
  //     db.creditcard.create({
  //       user_id: req.user.id,
  //       card_name: req.body.card_name,
  //       card_no: req.body.card_no,
  //       valid_date: req.body.valid_date
  //     })
  //   }
  // )

  // app.get('/validate-top', (req, res) => {
  //   db.otpTables.findOne({
  //     where: {
  //       otp: req.body.otpNumber,
  //       user_id: req.user.id,
  //     }
  //   })
  // })
}