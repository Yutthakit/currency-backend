const passport = require('passport')


module.exports = (app, db) => {



  app.post('/add-balance', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const targetUser = await db.profitloss.findOne({ where: { user_id: req.user.id } })
      if (targetUser) {
        targetUser.update({
          balance: targetUser.balance + req.body.balance
        })
        res.status(200).send({ message: `Add money ${req.body.balance} success` })
      } else {
        res.status(403).send({message : 'Mistake'})
      }
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