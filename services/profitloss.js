const passport = require('passport')


module.exports = (app, db) => {

  app.post('/buy-currency', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const user_id = req.user.id;
      const currency_name = req.body.currency_name;
      const value_invest = req.body.value_invest;
      const currency_price_purchase = req.body.currency_price_purchase

      db.profitloss.findOne({ where: { user_id: req.user.id, currency_name: req.body.currency_name } })
        .then(profitloss => {
          if (profitloss.currency_name == null || profitloss.currency_name !== currency_name) {
            db.profitloss.create({
              user_id,
              currency_price_purchase,
              value_invest,
              currency_name
            })
            res.status(200).send({ message: `${currency_name} invest id :${user_id} value ${value_invest} success` })
          } else {
            const currency_price_purchase_cal = ((parseFloat(profitloss.currency_price_purchase) * parseFloat(profitloss.value_invest)) + (parseFloat(currency_price_purchase) * parseFloat(value_invest))) / (parseFloat(profitloss.value_invest) + parseFloat(value_invest));
            const value_invest_cal = parseFloat(profitloss.value_invest) + parseFloat(value_invest)
            profitloss.update({
              currency_price_purchase: currency_price_purchase_cal,
              value_invest: value_invest_cal,
            })
            res.status(200).send({ message: `invest id :${user_id} value ${value_invest} success` })
          }
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });

      const targetUser = await db.user.findOne({ where: { id: user_id } })
      const balance = targetUser.Balance;
      if (targetUser) {
        targetUser.update({
          Balance: parseFloat(balance) - parseFloat(value_invest)
        })

        db.trading.create({
          action: req.body.action,
          currency_name,
          currency_price: currency_price_purchase,
          value: value_invest,
          user_id,
        })
      }
      res.status(200).send({ message: 'Balance is update' })
    }
  )



  app.post('/sell-currency', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const value_sell = req.body.value_sell
      const action = req.body.action
      const currency_name = req.body.currency_name
      const currency_price_sell = req.body.currency_price_sell

      db.profitloss.findOne({ where: { user_id: req.user.id, currency_name: req.body.currency_name } })
        .then(profitloss => {
          profitloss.update({
            value_invest: (parseFloat(profitloss.value_invest) - parseFloat(value_sell))
          })
          res.status(200).send({ message: `sell ${req.body.currency_name, value_sell} success  ` })
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });

      const currency_price_sell_cal = (parseFloat(currency_price_sell) * parseFloat(value_sell))
      const targetUser = await db.user.findOne({ where: { id: req.user.id } })
      if (targetUser) {
        targetUser.update({
          Balance: parseFloat(balance) - parseFloat(currency_price_sell_cal)
        })

        db.trading.create({
          action,
          currency_name,
          currency_price: currency_price_sell,
          value: value_sell,
          user_id,
        })
      }
      res.status(200).send({ message: 'Balance is update' })
    }
  )

  // app.post('/add-balance', passport.authenticate('jwt', { session: false }),
  //   async (req, res) => {
  //     const targetUser = await db.profitloss.findOne({ where: { user_id: req.user.id } })
  //     if(targetUser){
  //       targetUser.update({
  //         balance: targetUser.balance + req.body.balance
  //       })
  //     }else {
  //       res.status(404).send({})
  //     }
  //   }
  // )
}