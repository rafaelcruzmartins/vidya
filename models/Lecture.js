import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lecture = sequelize.define("Lecture", {
  name: DataTypes.STRING,
  url: DataTypes.STRING,
  contentName: DataTypes.STRING,
  contentUrl: DataTypes.STRING,
  hasCompleted: DataTypes.BOOLEAN,
});

export default Lecture;
