const passport = require('passport')


module.exports = (app, db) => {

  app.post('/withdrawal', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const withdrawal = req.body.amount
      const targetUser = await db.user.findOne({ where: { id: req.user.id } })
      if ( parseInt(targetUser.Balance) > parseInt(withdrawal)) {
        db.transaction.create({
          user_id: req.user.id,
          action : req.body.action,
          value : req.body.amount
        })
        targetUser.update({
          balance: parseInt(targetUser.balance) - parseInt(withdrawal)
        })
        res.status(200).send({ message: `Withdraw money ${req.body.amount} success` })
      } else {
        res.status(403).send({ message: 'Mistake' })
      }
    }
  )
}