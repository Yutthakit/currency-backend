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
        order: [
          ["createdAt", "DESC"]
        ],
      });

      const {
        value,
        currency_name
      } = targetPrice;

      const digit = Math.floor(Math.random() * 4 + 1);
      const dot = Math.floor(Math.random() * 100 + 1);
      const randomPosition = randomNumber(0, 3);

      function randomNumber(min, max) {
        return Math.random() * (max - min) + min;
      }
      console.log(parseInt(randomPosition))
      switch (parseInt(randomPosition)) {
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
          const percentPlus = 1 + Number(`${digit}.${dot}`) / 100;
          const newValPlus = Number(value) * Number(percentPlus);
          await db.price_store
            .create({
              currency_name,
              value: transfromData(currency_name, newValPlus),
            })
            .then(() => console.log("Created Done"))
            .catch((err) => console.log(err));
          break;
        case 2:
          const percentDown = 1 - Number(`${digit}.${dot}`) / 100;
          const newValDown = Number(value) * Number(percentDown);
          await db.price_store
            .create({
              currency_name,
              value: transfromData(currency_name, newValDown),
            })
            .then(() => console.log("Created Done"))
            .catch((err) => console.log(err));
          break;
      }
    }
  };

  const transfromData = (type, num) => {
    let result
    switch (type) {
      case 'BTC':
        result = parseInt(num)
        break;

      case 'ETH':
        result = parseInt(num)
        break;

      case 'LTC':
        result = parseInt(num)
        break;

      case 'XRP':
        result = parseFloat(num).toFixed(2)
        break;

    }
    return result
  }

  createPrice();
};