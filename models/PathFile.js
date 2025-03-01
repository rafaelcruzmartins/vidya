import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
const PathFile = sequelize.define("PathFile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default PathFile;
