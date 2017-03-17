module.exports = function(sequelize, DataTypes) {
  var UserProject = sequelize.define("UserProject", {
    // Giving the Author model a name of type STRING
    stripe_charge: DataTypes.STRING,
    amount: DataTypes.INTEGER
  });
  
  return UserProject;
};
