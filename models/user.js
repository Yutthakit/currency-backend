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
      type: DataTypes.DATE(6)
    },
    password: {
      type: DataTypes.STRING(500)
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male')
    },
    user_id: {
      type: DataTypes.STRING(8)
    },
    role: {
      type: DataTypes.ENUM("admin", "user")
    }
  })

  user.associate = (models) => {
    user.hasMany(models.creditcard, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.profitloss, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.transaction, { foreignKey: 'user_id', onDelete: 'CASCADE' })
    user.hasMany(models.trading, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  }

  return user
}  
