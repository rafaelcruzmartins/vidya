import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import crypto from "crypto";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(1024),
    allowNull: false,
    set(value) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(value, salt, 1000, 64, "sha512")
        .toString("hex");

      this.setDataValue("salt", salt);
      this.setDataValue("password", hash);
    },
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
});

export default User;
