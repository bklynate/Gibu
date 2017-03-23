const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    }
  }, {
    classMethods: {
        validPassword: function(password, passwd, callback) {
          // console.log('validPassword password', password);
          // console.log('validPassword passwd', passwd);
          bcrypt.compare(password, passwd, function(err, isMatch) {
            console.log('isMatch', isMatch);
            if (isMatch) {
              console.log('found match');
              return callback(null, true);
            } else {
              console.log('returning false');
              return callback(null, false);
            }
          });
        },
        associate: function(models) {
          // Associating Author with Posts
          // When an Author is deleted, also delete any associated Posts
          User.belongsToMany(models.Project, {through: 'UserProject'});
          User.hasOne(models.Project);
        }
      }
  }, {dialect: 'mysql'});

  User.hook('beforeCreate', function(user, {}, next) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        console.log('hash', hash);
        return next(null, user);
      });
    });
  });

  return User;
};
