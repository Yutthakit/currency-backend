const passport = require("passport");

module.exports = (app, db) => {
  app.post(
    "/buy-currency",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const { user, body } = req;
        const { id: user_id } = user;
        const {
          value_invest, // buy 600 thb
          currency_name,
          currency_price_purchase, // ราคาต่อตัว 300
          value_per_unit: valueOfCurrencyPerUnit,
        } = body;

        // const valueOfCurrencyPerUnit = Number(value_invest)/ Number(currency_price_purchase) // จำนวนหุ้น 2 ตัว

        // check history
        const targetProfit = await db.profitloss.findOne({
          where: { user_id, currency_name },
        });
        console.log(targetProfit)

        if (targetProfit) {
          const {
            value_invest: OldValueInvest,
            value_per_unit: OldValuePerUnit,
          } = targetProfit;

          const newValueInvest =
            parseFloat(value_invest) + parseFloat(OldValueInvest);
          const newValuePerUnit =
            parseFloat(valueOfCurrencyPerUnit) + parseFloat(OldValuePerUnit);
          const newCurrencyPrice =
            parseFloat(newValueInvest) / parseFloat(newValuePerUnit);
          console.log(
             newValueInvest,
             newCurrencyPrice,
             newValuePerUnit,
          )
          await targetProfit.update({
            currency_price_purchase: newCurrencyPrice,
            value_invest: newValueInvest,
            value_per_unit: newValuePerUnit,
          });
        } else {
          const dataProfitloss = {
            currency_price_purchase,
            value_invest,
            value_per_unit: valueOfCurrencyPerUnit,
            currency_name,
            user_id,
          };
          await db.profitloss.create(dataProfitloss);
        }

        const targetUser = await db.user.findOne({ where: { id: user_id } });
        const { Balance } = targetUser;
        const newBalance = parseFloat(Balance) - parseFloat(value_invest);
        await targetUser.update({
          Balance: newBalance,
        });

        res.status(200).send({ message: "Success" });
      } catch (error) {
        res.status(400).send({ message: error });
      }
    }
  );

  app.post(
    "/sell-currency",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const { body, user } = req;
        const { id: user_id } = user;
        const { value_per_unit, currency_name, currency_price_sell } = body;

        const targetProfit = await db.profitloss.findOne({
          where: { user_id, currency_name },
        });
        if (targetProfit) {
          const {
            value_per_unit: OldValuePerUnit,
            value_invest: OldValueInvest,
            currency_price_purchase: OldCurrencyPrice,
          } = targetProfit;
          checkValue(OldValuePerUnit, value_per_unit);

          const percenWeight =
            1 - parseFloat(value_per_unit) / parseFloat(OldValuePerUnit);
          const newValuePerUnit =
            parseFloat(OldValuePerUnit) * parseFloat(percenWeight);
          const newValueInvest =
            parseFloat(OldValueInvest) * parseFloat(percenWeight);
          const newCurrencyPrice =
            parseFloat(OldCurrencyPrice) * parseFloat(percenWeight);
          await targetProfit.update({
            currency_price_purchase: newValueInvest,
            value_invest: newCurrencyPrice,
            value_per_unit: newValuePerUnit,
          });

          const valueSell =
            parseFloat(currency_price_sell) * parseFloat(value_per_unit);

          const targetUser = await db.user.findOne({ where: { id: user_id } });
          const { Balance } = targetUser;
          console.log(Balance)
          const newBalance = parseFloat(Balance) + parseFloat(valueSell);
          console.log(newBalance)
          await targetUser.update({
            Balance: newBalance,
          });
        } else {
          throw Error(`Can't sell currency`);
        }
        res.status(200).send({ message: "Balance is update" });
      } catch (error) {
        console.log(error)
        if (error == 'Error: Value Per Unit not enough') {
          res.status(308).send(error.message);
        }
        res.status(400).send({ message: error });
      }
    }
  );

  const checkValue = (oldValue, newValue) => {
    if (oldValue > newValue) {
      return;
    } else {
      throw new Error("Value Per Unit not enough");
    }
  };

  app.get(
    "/profitloss/profile",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        console.log('1')
        const { id: user_id } = req.user;
        const targetProfit = await db.profitloss.findAll({
          where: { user_id },
        });
        
        const result = [];
        if (targetProfit) {
          console.log('1.1')
          for (let i = 0; i < targetProfit.length; i++) {
            console.log('1.2')
            const {
              currency_name,
              value_per_unit,
              value_invest,
            } = targetProfit[i];

            const { value } = await db.price_store.findOne({
              where: {
                currency_name,
              },
              // order: [["createdAt", "DESC"]],
            });
            console.log(value);
            const amount = parseFloat(value_invest) * parseFloat(value_per_unit)
            const marketVal = parseFloat(value_per_unit) * parseFloat(value)
            const diffPrice = marketVal - amount
            const calPercent = (diffPrice / amount) * 100
            result.push({
              name: currency_name,
              value_per_unit,
              value_invest,
              actual_value: amount,
              market_value: marketVal,
              percent: calPercent.toFixed(2)
            })
          }
        }

        res.status(200).send(result);
      } catch (error) {
        console.log(error)
      }
    }
  );
};
