import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import os from "os";
import { isAdminOrFirstStartUp } from "../middleware/owner.js";
const execPromise = util.promisify(exec);

const router = Router();

const isWindows = os.platform() === "win32";

const normalizePath = (inputPath) => {
  if (!inputPath) return isWindows ? "C:\\" : "/";

  if (isWindows) {
    // Handle drive letter paths
    if (inputPath.match(/^[A-Za-z]:$/)) {
      return `${inputPath}\\`;
    }
    // Normalize Windows path and ensure proper trailing slash
    const normalized = path.normalize(inputPath);
    return normalized.endsWith("\\") ? normalized : `${normalized}\\`;
  }

  return path.normalize(inputPath);
};

const getParentDirectory = (currentPath) => {
  if (!currentPath) return null;

  if (isWindows) {
    // Handle root of drive (e.g., "C:\")
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

const isValidPath = (basePath, targetPath) => {
  if (isWindows) {
    // For Windows, compare drive letters and paths separately
    const normalizedBase = path.resolve(basePath).toLowerCase();
    const normalizedTarget = path.resolve(targetPath).toLowerCase();

    // Get drive letters
    const baseDrive = normalizedBase.split(":")[0];
    const targetDrive = normalizedTarget.split(":")[0];

    // If on different drives, it's okay
    if (baseDrive !== targetDrive) {
      return true;
    }

    // If on same drive, check if target is under base
    return normalizedTarget.startsWith(normalizedBase);
  } else {
    // Unix-like systems
    return path.resolve(targetPath).startsWith(path.resolve(basePath));
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

router.get("/drives", isAdminOrFirstStartUp, async (req, res) => {
  try {
    const drives = await getSystemDrives();
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/browse", isAdminOrFirstStartUp, async (req, res) => {
  try {
    let directoryPath = normalizePath(req.query.path);

    // For Windows, check if we're at drive root level
    if (isWindows && directoryPath.match(/^[A-Za-z]:\\$/)) {
      // Skip path validation for drive roots
    } else {
      if (!isValidPath(directoryPath, path.resolve(directoryPath))) {
        throw new Error("Invalid path");
      }
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
