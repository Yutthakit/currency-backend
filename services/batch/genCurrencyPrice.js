module.exports = (db) => {
  const createPrice = async () => {
    const DICT = {
      0: "BTC",
      1: "ETH",
      2: "LTC",
      3: "XRP",
    };
    for (let i = 0; i < 4; i++) {
      const targetPrice = await db.price_store.findOne({
        where: {
          currency_name: DICT[i],
        },
        order: [["createdAt", "DESC"]],
      });
      const { value, currency_name } = targetPrice;

      const digit = Math.floor(Math.random() * 10 + 1);
      const dot = Math.floor(Math.random() * 100 + 1);
      const randomPosition = randomNumber(0, 2);
      function randomNumber(min, max) {
        return Math.random() * (max - min) + min;
      }
      switch (randomPosition) {
        case 0:
          await db.price_store
            .create({
              currency_name,
              value,
            })
            .then(() => console.log("Created Done"))
            .catch((err) => console.log(err));
          break;
        case 1:
          const percent = 1 + Number(`${digit}.${dot}`) / 100;
          const newVal = Number(value) * Number(percent);
          await db.price_store
            .create({
              currency_name,
              value: newVal,
            })
            .then(() => console.log("Created Done"))
            .catch((err) => console.log(err));
          break;
        case 2:
          const percent = 1 - Number(`${digit}.${dot}`) / 100;
          const newVal = Number(value) * Number(percent);
          await db.price_store
            .create({
              currency_name,
              value: newVal,
            })
            .then(() => console.log("Created Done"))
            .catch((err) => console.log(err));
          break;
      }
    }
  };

  createPrice();
};
