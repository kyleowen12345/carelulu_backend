'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
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
          });
      this.belongsTo(models.Task, 
        { 
            foreignKey: 'taskId',
              as: 'task'
        })
    }
  }
  Step.init({
    content: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Step',
    timestamps:true
  });
  return Step;
};