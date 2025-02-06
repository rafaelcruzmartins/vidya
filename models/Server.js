import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Server = sequelize.define("Server", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isFirstStartUp: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export default Server;
