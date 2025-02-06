import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const UserLastWatched = sequelize.define("UserLastWatched", {
  lastWatchedAt: DataTypes.DATE,
});

export default UserLastWatched;
