import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Course = sequelize.define("Course", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  instructorName: DataTypes.STRING,
  photo: DataTypes.STRING,
  hasCompleted: DataTypes.BOOLEAN,
  folder: DataTypes.STRING,
});

export default Course;
