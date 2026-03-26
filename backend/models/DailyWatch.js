import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const DailyWatch = sequelize.define(
  "DailyWatch",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    watchTimeSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["date", "UserId"],
      },
    ],
  }
);

export default DailyWatch;
