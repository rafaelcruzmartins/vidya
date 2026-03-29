import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, "../../");

function getDataPath() {
  if (process.env.VIDYA_DATA_PATH) {
    return path.normalize(process.env.VIDYA_DATA_PATH);
  }

  const dataPathFile = path.join(serverRoot, "dataPath.json");
  if (fs.existsSync(dataPathFile)) {
    const config = JSON.parse(fs.readFileSync(dataPathFile, "utf8"));
    return path.normalize(config.dataPath);
  }

  return serverRoot;
}

export const DATA_PATH = getDataPath();
export const DB_PATH = path.join(DATA_PATH, "database.sqlite");
export const ASSETS_PATH = path.join(DATA_PATH, "assets");
export const KEYS_PATH = path.join(DATA_PATH, "keys.json");
export const WEB_PATH = path.join(serverRoot, "build");
export const PORT = parseInt(process.env.PORT || "31415", 10);
