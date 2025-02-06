import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Section = sequelize.define("Section", {
  originalName: DataTypes.STRING,
  cleanedName: DataTypes.STRING,
  order: DataTypes.FLOAT,
});

export default Section;
