import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

// Cursos que uma conta escolheu não ver. É por usuário, não global: o catálogo
// continua o mesmo no disco e para as outras contas.
const HiddenCourse = sequelize.define(
  "HiddenCourse",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    indexes: [{ unique: true, fields: ["UserId", "CourseId"] }],
  },
);

export default HiddenCourse;
