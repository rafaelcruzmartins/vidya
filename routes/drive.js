import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import os from "os";
import { Server, User } from "../models/index.js";
const execPromise = util.promisify(exec);

const router = Router();

const isWindows = os.platform() === "win32";

const normalizePath = (inputPath) => {
  if (!inputPath) return isWindows ? "C:\\" : "/";

  if (isWindows) {
    if (inputPath.match(/^[A-Za-z]:$/)) {
      return `${inputPath}\\`;
    }
    return path.normalize(inputPath);
  }

  return path.normalize(inputPath);
};

const getParentDirectory = (currentPath) => {
  if (!currentPath) return null;

  if (isWindows) {
    if (currentPath.match(/^[A-Za-z]:\\$/)) {
      return null;
    }
    const parent = path.dirname(currentPath);
    return parent.endsWith("\\") ? parent : `${parent}\\`;
  } else {
    if (currentPath === "/") return null;
    return path.dirname(currentPath);
  }
};

const getSystemDrives = async () => {
  if (isWindows) {
    try {
      const { stdout } = await execPromise("wmic logicaldisk get name");
      const drives = stdout
        .split("\n")
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.match(/^[A-Z]:$/))
        .map((drive) => ({
          path: `${drive}\\`,
          label: drive,
          accessible: true,
          type: "drive",
        }));

      return drives;
    } catch (error) {
      console.error("Error getting Windows drives:", error);
      return [
        {
          path: "C:\\",
          label: "C:",
          accessible: true,
          type: "drive",
        },
      ];
    }
  } else {
    try {
      const { stdout } = await execPromise(
        "cat /proc/mounts | grep '^/' | awk '{print $1 \" \" $2}'"
      );
      const mounts = stdout
        .split("\n")
        .filter((line) => line)
        .map((line) => {
          const [device, mountPoint] = line.split(" ");
          return {
            path: mountPoint,
            label: device,
            accessible: true,
            type: "mount",
          };
        })
        .filter((mount) => {
          const excludePaths = [
            "/boot",
            "/dev",
            "/proc",
            "/sys",
            "/run",
            "/snap",
          ];
          return !excludePaths.some((excluded) =>
            mount.path.startsWith(excluded)
          );
        });

      mounts.unshift({
        path: os.homedir(),
        label: "Home",
        accessible: true,
        type: "home",
      });

      mounts.unshift({
        path: "/",
        label: "Root",
        accessible: true,
        type: "root",
      });

      return mounts;
    } catch (error) {
      console.error("Error getting Linux mount points:", error);
      return [
        {
          path: "/",
          label: "Root",
          accessible: true,
          type: "root",
        },
      ];
    }
  }
};

router.get("/drives", async (req, res) => {
  try {
    const result = await Server.findAll();
    if (result[0].isFirstStartUp || req.user.role === "admin") {
      const drives = await getSystemDrives();
      res.json(drives);
    } else {
      res.status(403).json({ error: "admin access required" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/browse", async (req, res) => {
  try {
    const result = await Server.findAll();
    if (result[0].isFirstStartUp || req.user.role === "admin") {
      let directoryPath = normalizePath(req.query.path);
      console.log(directoryPath);
      const resolvedPath = path.resolve(directoryPath);
      if (!resolvedPath.startsWith(directoryPath)) {
        throw new Error("Invalid path");
      }

      const contents = await fs.readdir(directoryPath, { withFileTypes: true });

      const items = await Promise.all(
        contents.map(async (item) => {
          const itemPath = path.join(directoryPath, item.name);
          let itemInfo = {
            name: item.name,
            isDirectory: item.isDirectory(),
            path: normalizePath(itemPath),
            size: null,
            modifiedTime: null,
            type: item.isDirectory() ? "directory" : "file",
          };

          try {
            const stats = await fs.stat(itemPath);
            itemInfo.size = stats.size;
            itemInfo.modifiedTime = stats.mtime;
          } catch (e) {
            itemInfo.error = "Access denied";
          }

          return itemInfo;
        })
      );

      items.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      const parentDir = getParentDirectory(directoryPath);

      res.json({
        currentPath: directoryPath,
        parentDirectory: parentDir,
        items: items,
      });
    } else {
      res.status(403).json({ error: "admin access is required" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/save-path", (req, res) => {
  try {
    const { selectedPath } = req.body;
    res.json({ savedPath: selectedPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
console.log(`Operating System: ${os.platform()}`);
export default router;
