import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lecture = sequelize.define("Lecture", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  originalName: DataTypes.STRING,
  cleanedName: DataTypes.STRING,
  order: DataTypes.FLOAT,
  type: DataTypes.STRING,
  path: DataTypes.STRING,
  content: DataTypes.JSON,
  subtitles: DataTypes.JSON,
  duration: DataTypes.FLOAT,
  // Identidade do arquivo no sistema de arquivos (dispositivo:inode). Sobrevive
  // a renomeações, ao contrário do nome, e é o que permite reconhecer o mesmo
  // curso/seção/aula depois que a pasta muda de nome.
  sourceId: DataTypes.STRING,
});

export default Lecture;
