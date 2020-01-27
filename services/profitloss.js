const passport = require('passport')


module.exports = (app, db) => {

  app.post('/buy-currency', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      // console.log(value_invest)
      db.profitloss.findOne({ where: { user_id: req.user.id, currency_name: req.body.currency_name } })
        .then(profitloss => {
          if (profitloss == null) {
            db.profitloss.create({
              user_id: req.user.id,
              currency_price_purchase: req.body.currency_price_purchase,
              value_invest: req.body.value_invest,
              currency_name: req.body.currency_name
            })
            res.status(200).send({ message: `${req.body.currency_name} invest id :${req.user.id} value ${req.body.value_invest} success` })
          } else {
            console.log(profitloss.currency_name)
            console.log(req.body.currency_name)
            if (profitloss.currency_name !== req.body.currency_name) {
              db.profitloss.create({
                user_id: req.user.id,
                currency_price_purchase: req.body.currency_price_purchase,
                value_invest: req.body.value_invest,
                currency_name: req.body.currency_name
              })
              res.status(200).send({ message: `${req.body.currency_name} invest id :${req.user.id} value ${req.body.value_invest} success` })
            } else {
              const oldInvest = (parseFloat(profitloss.currency_price_purchase) * parseInt(profitloss.value_invest))
              const newInvest = (parseFloat(req.body.currency_price_purchase) * parseInt(req.body.value_invest))
              const divine  = (parseInt(profitloss.value_invest) + parseInt(req.body.value_invest))
              profitloss.update({
                currency_price_purchase: ((parseInt(profitloss.currency_price_purchase) * parseInt(profitloss.value_invest)) + (parseInt(req.body.currency_price_purchase) * parseInt(req.body.value_invest))) / (parseInt(profitloss.value_invest) + parseInt(req.body.value_invest)),

                value_invest: (parseInt(profitloss.value_invest) + parseInt(req.body.value_invest))
              })
              res.status(200).send({ message: `invest id :${req.user.id} value ${req.body.value_invest} success` })

              console.log(parseInt(profitloss.currency_price_purchase))
              console.log(req.body.currency_price_purchase)
              console.log(req.body.value_invest)
              console.log(oldInvest)
              console.log(newInvest)
              console.log(divine)
            }
          }
        }).catch((err) => {
          res.status(400).send({ message: err.message })
        });
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