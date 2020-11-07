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
            currency_price_purchase: newValueInvest,
            value_invest: newCurrencyPrice,
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
          const newBalance = parseFloat(Balance) + parseFloat(valueSell);
          await targetUser.update({
            Balance: newBalance,
          });
        } else {
          throw Error(`Can't sell currency`);
        }
        res.status(200).send({ message: "Balance is update" });
      } catch (error) {
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
};
