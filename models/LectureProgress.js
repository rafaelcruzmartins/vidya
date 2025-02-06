import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const LectureProgress = sequelize.define("LectureProgress", {
  progress: DataTypes.INTEGER,
  hasCompleted: DataTypes.BOOLEAN,
  watchTime: DataTypes.INTEGER,
});

export default LectureProgress;
