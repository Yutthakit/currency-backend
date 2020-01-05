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
    email: {
      type: DataTypes.STRING(100)
    },
    birth_date: {
      type: DataTypes.STRING(255)
    },
    password: {
      type: DataTypes.STRING(20)
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male')
    }
  })
  return user
}  