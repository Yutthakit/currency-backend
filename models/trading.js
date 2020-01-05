module.exports = (sequelize, DataTypes) => {
  const trading = sequelize.defien('trading', {
    action : {
      type : DataTypes.ENUM('Buy', 'Sell')
    },
    currency : {
      type: DataTypes.ENUM('BTC', 'ETH', 'LTC', 'XRP', 'ZEC')
    },
    currency_rate : {
      type : DataTypes.STRING(10)
    },
    invest : {
      type : DataTypes.STRING(10)
    }
  })
  

  return trading
}