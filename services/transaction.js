const passport = require('passport')
const moment = require('moment')


module.exports = (app, db) => {

  app.post ('/deposit', passport.authenticate('jwt', { session: false}), async (req, res) => {
    try {
      const { body, user } = req
      const { id: userId } = user
      const { amount } = body

      const targetUser = await db.user.findOne({
        where: { id: userId }
      })
      const { Balance: OldBalance } = targetUser

      db.transaction.create({
        user_id: userId,
        value: amount,
        action: 'Deposit'
      })

      targetUser.update({
        Balance: parseInt(OldBalance) + parseInt(amount)
      })

      res.status(200).send({
        message: `Deposit money ${req.body.amount} success`
      })

    } catch (error) {
      console.log(error);
    }
  })

  app.post('/withdrawal', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { body, user } = req
      const { id: userId } = user
      const { amount } = body

      const targetUser = await db.user.findOne({
        where: { id: userId }
      })

      const { Balance: OldBalance } = targetUser

      await checkBalance(OldBalance, amount)

      db.transaction.create({
        user_id: userId,
        value: amount,
        action: 'Withdrawal'
      })

      targetUser.update({
        Balance: parseInt(OldBalance) - parseInt(amount)
      })

      res.status(200).send({
        message: `Withdraw money ${req.body.amount} success`
      })

    } catch (error) {
      res.status(401).send({
        message: error
      })
    }
  })

  const checkBalance = async (balance, withdraw) => {
    if (balance > withdraw)
      return
    else
      throw Error('Balance is not enough')
  }

  app.get('/history-transaction',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const {
        user
      } = req
      const {
        id: userId
      } = user
      const data = await  db.transaction.findAll({
        where: {
          user_id: userId
        }
      })

      const result = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].value !== '0') {
          result.push({
            key: i+1,
            action: [data[i].action],
            value: data[i].value,
            createdAt: moment(data[i].createdAt).format('LLLL'),
          })
        }
      }
      res.status(200).send(result)
    } catch (error) {
      
    }
  })



}