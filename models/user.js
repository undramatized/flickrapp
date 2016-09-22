'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:{
          msg: "Invalid Email Address"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,99],
          msg: "Name must be between 1 to 99 characters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: "Password must be at least 8 characters"
        }
      }
    }
  }, {
    hooks:{
      beforeCreate: function(newUser, options, cb){
        var hash = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hash;
        cb(null, newUser);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      validPassword: function(pw){
        return bcrypt.compareSync(pw, this.password);
      },
      toJSON: function(){
        var user = this.get();
        delete user.password;
        return user;
      }
    }
  });
  return user;
};
