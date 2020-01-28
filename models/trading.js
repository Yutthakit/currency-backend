module.exports = (sequelize, DataTypes) => {
  const trading = sequelize.define('trading', {
    action : {
      type : DataTypes.ENUM('Buy', 'Sell')
    },
    currency_name : {
      type: DataTypes.ENUM('BTC', 'ETH', 'LTC', 'XRP', 'ZEC')
    },
    currency_price : {
      type : DataTypes.STRING(10)
    },
    value : {
      type : DataTypes.STRING(10)
    }
  })
  
  trading.associate = (models) => {
    trading.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE'})
  }

  return trading
}