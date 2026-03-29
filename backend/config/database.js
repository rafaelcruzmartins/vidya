import { Sequelize } from "sequelize";
import { DB_PATH } from "./path.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,

  retry: {
    match: [/SQLITE_BUSY/],
    max: 5,
    backoffBase: 200,
  },
  logging: false,
});
export default sequelize;
