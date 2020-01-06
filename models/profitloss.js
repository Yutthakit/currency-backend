module.exports = (sequelize, DataTypes) => {
  const profitloss = sequelize.define('profitloss', {
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

  profitloss.associate = (models) => {
    profitloss.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE'})
  }

  return profitloss
}