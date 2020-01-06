module.exports = (sequelize, DataTypes) => {
  const creditcard = sequelize.define('creditcard', {
    card_name: {
      type: DataTypes.STRING(100)
    },
    card_no: {
      type: DataTypes.STRING(16)
    },
    valid_date: {
      type: DataTypes.DATE
    }
  })

  creditcard.associate = (models) => {
    creditcard.belongsTo(models.user , { foreignKey: 'user_id', onDelete: 'CASCADE'})
  }
  return creditcard
}