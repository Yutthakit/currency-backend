const HISTORY = require('../static');

module.exports = (app) => {
  app.get('/static/history/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params
      const data = HISTORY[`${symbol}`]
      res.send(data)
    } catch (error) {
      res.status(400).send(error)
    } 
  })
}
