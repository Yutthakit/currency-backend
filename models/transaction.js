module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.defien('transaction', {
    action : {
      type : DataTypes.ENUM('Deposit', 'Withdrawal')
    },
    value : {
      type: DataTypes.STRING(16)
    }
  })
  

  return creditcard
}