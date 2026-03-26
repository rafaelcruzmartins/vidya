import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const LectureProgress = sequelize.define("LectureProgress", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  progress: DataTypes.INTEGER,
  hasCompleted: DataTypes.BOOLEAN,
  watchTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default LectureProgress;
