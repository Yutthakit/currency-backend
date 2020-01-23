module.exports = (sequelize, DataTypes) => {
  const number_otp = sequelize.define('number_otp', {
    number_otp: {
      type: DataTypes.INTEGER(4)
    }
  })

  number_otp.associate = (models) => {
    number_otp.belongsTo(models.user, { foreignKey: 'user_id' })
  }

  return number_otp
}