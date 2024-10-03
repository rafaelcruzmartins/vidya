import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Section = sequelize.define("Section", {
  name: DataTypes.STRING,
  hasCompleted: DataTypes.BOOLEAN,
});

export default Section;
