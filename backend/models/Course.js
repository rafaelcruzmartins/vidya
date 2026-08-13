import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  originalName: DataTypes.STRING,
  cleanedName: DataTypes.STRING,
  directory: DataTypes.STRING,
  description: DataTypes.TEXT,
  photo: DataTypes.STRING,
  duration: DataTypes.FLOAT,
  // Identidade do arquivo no sistema de arquivos (dispositivo:inode). Sobrevive
  // a renomeações, ao contrário do nome, e é o que permite reconhecer o mesmo
  // curso/seção/aula depois que a pasta muda de nome.
  sourceId: DataTypes.STRING,
});

export default Course;
