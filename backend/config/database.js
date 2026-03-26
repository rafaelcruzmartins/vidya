import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),

  retry: {
    match: [/SQLITE_BUSY/],
    max: 5,
    backoffBase: 200,
  },
  logging: false,
});
export default sequelize;
