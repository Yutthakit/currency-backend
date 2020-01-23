module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING(60)
    },
    surname: {
      type: DataTypes.STRING(60)
    },
    tel: {
      type: DataTypes.STRING(10)
    },
    username: {
      type: DataTypes.STRING(100)
    },
    birth_date: {
      type: DataTypes.DATE
    },
    password: {
      type: DataTypes.STRING(500)
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male')
    },
    role: {
      type: DataTypes.ENUM("admin", "user")
    }
  })

  user.associate = (models) => {
    user.hasMany(models.credit_card, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.profitloss, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.transaction, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.trading, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.number_otp, { foreignKey: 'user_id' })
  }

  return user
}  
