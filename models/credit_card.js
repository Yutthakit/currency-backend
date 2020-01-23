module.exports = (sequelize, DataTypes) => {
  const credit_card = sequelize.define('credit_card', {
    card_name: {
      type: DataTypes.STRING(100)
    },
    card_no: {
      type: DataTypes.STRING(16)
    },
    valid_year: {
      type: DataTypes.INTEGER(2)
    },
    valid_month: {
      type: DataTypes.INTEGER(2)
    }
  })

  credit_card.associate = (models) => {
    credit_card.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  }
  return credit_card
}