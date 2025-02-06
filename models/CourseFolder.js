import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const CourseFolder = sequelize.define("CourseFolder", {
  directory: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lastModified: {
    type: DataTypes.DATE,
  },
  lastChecked: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default CourseFolder;
