const passport = require("passport");

module.exports = (app, db) => {
  app.post(
    "/buy-currency",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      try {
        const {
          user,
          body
        } = req;
        const {
          id: user_id
        } = user;
        const {
          value_invest, // buy 600 thb
          currency_name,
          currency_price_purchase, // ราคาต่อตัว 300
          value_per_unit: valueOfCurrencyPerUnit,
        } = body;


        // check history
        const targetProfit = await db.profitloss.findOne({
          where: {
            user_id,
            currency_name
          },
        });

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

        const targetUser = await db.user.findOne({
          where: {
            id: user_id
          }
        });
        const {
          Balance
        } = targetUser;
        const newBalance = parseFloat(Balance) - parseFloat(value_invest);
        await targetUser.update({
          Balance: newBalance,
        });

        res.status(200).send({
          message: "Success"
        });
      } catch (error) {
        res.status(400).send({
          message: error
        });
      }
    }
  );

  app.post(
    "/sell-currency",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      try {
        const {
          body,
          user
        } = req;
        const {
          id: user_id
        } = user;
        const {
          value_invest,
          value_per_unit,
          currency_name,
        } = body;


        const targetProfit = await db.profitloss.findOne({
          where: {
            user_id,
            currency_name
          },
        });
        if (targetProfit) {
          if (targetProfit.value_per_unit > value_per_unit) {
            const {
              value_per_unit: OldValuePerUnit,
              currency_price_purchase: OldCurrency
            } = targetProfit;
            checkValue(OldValuePerUnit, value_per_unit);

            const newValuePerUnit = parseFloat(OldValuePerUnit) - parseFloat(value_per_unit);
            const newValueInvest = parseFloat(OldCurrency) * parseFloat(newValuePerUnit);
            console.log({
              currency_price_purchase: OldCurrency,
              value_invest: newValueInvest,
              value_per_unit: newValuePerUnit,
            });
            await targetProfit.update({
              currency_price_purchase: OldCurrency,
              value_invest: newValueInvest,
              value_per_unit: newValuePerUnit,
            });
          } else if (targetProfit.value_per_unit == value_per_unit) {
            console.log(targetProfit.id);
            await targetProfit.destroy({
              where: {
                id: targetProfit.id
              }
            })
          } else {
            throw new Error(`Can't sell currency`);
          }

          const targetUser = await db.user.findOne({
            where: {
              id: user_id
            }
          });
          const {
            Balance
          } = targetUser;
          const newBalance = parseFloat(Balance) + parseFloat(value_invest);
          await targetUser.update({
            Balance: newBalance,
          });
        } else {
          throw Error(`Can't sell currency`);
        }
        res.status(200).send({
          message: "Balance is update"
        });
      } catch (error) {
        if (error == 'Error: Value Per Unit not enough') {
          res.status(308).send(error.message);
        }
        res.status(400).send({
          message: error
        });
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
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      try {
        console.log('1')
        const {
          id: user_id
        } = req.user;
        const targetProfit = await db.profitloss.findAll({
          where: {
            user_id
          },
        });

        const result = [];
        if (targetProfit) {
          for (let i = 0; i < targetProfit.length; i++) {
            const {
              currency_name,
              value_per_unit,
              value_invest,
              currency_price_purchase
            } = targetProfit[i];

            const {
              value
            } = await db.price_store.findOne({
              where: {
                currency_name,
              },
              order: [
                ["createdAt", "DESC"]
              ],
            });
            console.log(value);
            const amount = parseFloat(value_invest)
            const marketVal = parseFloat(value_per_unit) * parseFloat(value)
            const diffPrice = marketVal - amount
            const calPercent = (diffPrice / amount) * 100
            result.push({
              name: currency_name,
              value_per_unit,
              value_invest: currency_price_purchase,
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