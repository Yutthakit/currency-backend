module.exports = (sequelize, DataTypes) => {
    const price_store = sequelize.define('price_store', {
      currency_name : {
        type: DataTypes.ENUM('BTC', 'ETH', 'LTC', 'XRP')
      },
      value : {
        type : DataTypes.STRING(10)
      }
    })

    return price_store
  }