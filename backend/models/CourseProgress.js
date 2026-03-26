import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const CourseProgress = sequelize.define("CourseProgress", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  progress: DataTypes.INTEGER,
  hasCompleted: DataTypes.BOOLEAN,
});

export default CourseProgress;
