const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config");

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: "user",
      key: "id",
    },
  },
}, {
  sequelize,
  timestamps: true,
  freezeTableName: true,
  modelName: "blog",
});

module.exports = Blog;
