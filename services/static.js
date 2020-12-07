// const HISTORY = require('../static');
const moment = require("moment");
const passport = require("passport");

module.exports = (app, db) => {
  app.get(
    "/static/history/:symbol",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      try {
        const {
          symbol
        } = req.params;
        const {
          id: user_id
        } = req.user;
        const BTC = [
          11482,
          11487,
          11487,
          11482,
          11481,
          11481,
          11480,
          11477,
          11481,
          11483,
        ];

        const ETH = [384, 383, 383, 382, 386, 386, 387, 392, 366, 370];

        const LTC = [19, 11, 12, 13, 26, 28, 26, 23, 30, 34];

        const XRP = [
          0.25,
          0.41,
          0.29,
          0.37,
          0.16,
          0.19,
          0.23,
          0.66,
          0.69,
          0.44,
        ];

        const DICT = {
          btc: BTC,
          eth: ETH,
          ltc: LTC,
          xrp: XRP,
        };
        const getDate = [];
        console.log('2')
        for (let i = 0; i < 10; i++) {
          const date = moment().subtract(i, "days").format("L");
          getDate.push(`${date}`);
        }

        const test = await db.profitloss.findOne({
          where: {
            currency_name: `${symbol}`,
            user_id
          }
        });
        
        const data = {
          price: DICT[`${symbol.toLowerCase()}`],
          date: getDate,
          has_invest: test ? test.value_invest !== 0 : false,
        };
        res.send(data);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  );
};