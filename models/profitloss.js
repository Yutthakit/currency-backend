module.exports = (sequelize, DataTypes) => {
  const profitloss = sequelize.define('profitloss', {
    currency_price_purchase : {
      type : DataTypes.FLOAT
    },
    value_invest : {
      type: DataTypes.FLOAT
    },
    currency_name : {
      type: DataTypes.ENUM('BTC', 'ETH', 'LTC', 'XRP', 'ZEC')
    },
    profit_loss : {
      type : DataTypes.STRING(30)
    },
    balance_in_currency: {
      type: DataTypes.STRING(30)
    }
  })

  profitloss.associate = (models) => {
    profitloss.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE'})
  }

  return profitloss
}