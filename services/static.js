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

        const price = [];

        const targetPrice = await db.price_store.findAll({
          where: {
            currency_name: symbol,
          },
          limit: 10,
          order: [
            ["createdAt", "DESC"]
          ],
        });

        for (let i = 0; i < targetPrice.length; i++) {
          const v = targetPrice[i]
          price.push(v.value)
        }

        const getDate = [];
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
          price ,
          date: getDate,
          has_invest: test ? test.value_invest !== 0 : false,
        };

        res.status(200).send(data);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  );
};