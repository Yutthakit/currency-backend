module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    action: {
      type: DataTypes.ENUM('Deposit', 'Withdrawal')
    },
    value: {
      type: DataTypes.STRING(16)
    }
  })

  transaction.associate = (models) => {
    transaction.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  }

  return creditcard
}