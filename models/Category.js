import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  category: DataTypes.STRING,
});

export default Category;
