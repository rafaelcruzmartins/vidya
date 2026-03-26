import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Instructor = sequelize.define("Instructor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: DataTypes.STRING,
  photo: DataTypes.STRING,
  description: DataTypes.STRING,
});

export default Instructor;
