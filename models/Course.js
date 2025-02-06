import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Course = sequelize.define("Course", {
  originalName: DataTypes.STRING,
  cleanedName: DataTypes.STRING,
  directory: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  instructorName: DataTypes.STRING,
  photo: DataTypes.STRING,
});

export default Course;
