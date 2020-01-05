module.exports = (sequelize, DataTypes) => {
  const creditcard = sequelize.defien('creditcard', {
    card_name : {
      type : DataTypes.STRING(100)
    },
    card_no : {
      type: DataTypes.STRING(16)
    },
    valid_date : {
      type : DataTypes.DATE
    }
  })
  

  return creditcard
}