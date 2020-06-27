const passport = require('passport')


module.exports = (app, db) => {

  app.post('/buy-currency', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {

      const { user, body } = req
      const { id: user_id } = user
      const {
        action,
        value_invest,
        currency_name,
        currency_price_purchase
      } = body

      const targetProfit = await db.profitloss.findOne({
        where: { user_id, currency_name }
      })

      const {
        currency_name: currencyName = null,
        currency_price_purchase: pricePurchase,
        value_invest: valueInvest
      } = targetProfit

      if (currencyName == null || currencyName != currency_name) {
        const dataProfitloss = {
          user_id,
          currency_price_purchase,
          value_invest,
          currency_name
        }
        await db.profitloss.create(dataProfitloss)
      } else {
        const currency_price_purchase_cal =
          ((parseFloat(pricePurchase) * parseFloat(valueInvest)) +
            (parseFloat(currency_price_purchase) * parseFloat(value_invest))) /
          (parseFloat(pricePurchase) + parseFloat(value_invest))

        const valueInvestCal = parseFloat(valueInvest) + parseFloat(value_invest)
        await targetProfit.update({
          currency_price_purchase: currency_price_purchase_cal,
          value_invest: valueInvestCal,
        })
      }

      const targetUser = await db.user.findOne({ where: { id: user_id } })
      const { Balance } = targetUser

      await targetUser.update({
        Balance: parseFloat(Balance) - parseFloat(value_invest)
      })

      const dataTrade = {
        action: req.body.action,
        currency_name,
        currency_price: currency_price_purchase,
        value: value_invest,
        user_id,
      }
      await db.trading.create(dataTrade)

      res.status(200).send({ message: 'Success' })
    } catch (error) {
      res.status(400).send({ message: error })
    }
  })



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