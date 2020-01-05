module.exports = (sequelize, DataTypes) => {
  const profitloss = sequelize.defien('profitloss', {
    balance : {
      type : DataTypes.INTEGER
    },
    remain : {
      type: DataTypes.INTEGER
    },
    currency : {
      type: DataTypes.ENUM('BTC', 'ETH', 'LTC', 'XRP', 'ZEC')
    },
    number_of_purchase : {
      type : DataTypes.STRING(2)
    }
  })

  return profitloss
}