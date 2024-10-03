import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Progress = sequelize.define("progress", {
  watchHours: DataTypes.INTEGER,
});

export default Progress;
