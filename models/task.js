'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, 
        { 
          foreignKey: 'userId',
          as: 'user'
        }
        );
      this.hasMany(models.Step,
        {
        foreignKey: 'taskId',
        as: 'steps'
        })
    }
  }
  Task.init({
    title: DataTypes.STRING,
    note: DataTypes.STRING,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
    timestamps:true
  });
  return Task;
};