import { Router } from "express";
import os from "os";
import fs, { promises as fsp } from "fs";
import path from "path";
import {
  Server,
  User,
  CourseFolder,
  Lecture,
  Section,
  Course,
} from "../models/index.js";
import { isAdminOrFirstStartUp, isAdmin } from "../middleware/owner.js";
const router = Router();
const isWindows = os.platform() === "win32";

const normalizePath = (inputPath) => {
  if (!inputPath) return isWindows ? "C:\\" : "/";

  if (isWindows) {
    if (inputPath.match(/^[A-Za-z]:$/)) {
      return `${inputPath}\\`;
    }

    const normalized = path.normalize(inputPath);
    return normalized.endsWith("\\") ? normalized : `${normalized}\\`;
  }

  return path.normalize(inputPath);
};

// Directory Parsing Logic

const VIDEO_EXT = new Set([".mp4", ".mkv", ".avi", ".mov"]);
const CONTENT_EXT = new Set([".html", ".txt", ".pdf", ".zip", ".md"]);
const SUB_EXT = new Set([".vtt", ".srt"]);

const naturalSort = (files) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return files.sort((a, b) => collator.compare(a, b));
};

const cleanNameCourse = (filename) => {
  return filename
    .replace(/^\d+[\d.-]*\s*[-.]?\s*/, "")
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/^[^-]+-\s*/, "")
    .replace(/\.[^.]+$/, "")
    .replace(/\s*\[[^\]]+\]\s*$/, "")
    .trim();
};
const cleanName = (filename) => {
  return filename
    .replace(/^\d+[\d.-]*\s*[-.]?\s*/, "")
    .replace(/\.[^.]+$/, "")
    .trim();
};

const parseBaseNumber = (filename) => {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const groupFiles = (files) => {
  const groups = new Map();

  files.forEach((file) => {
    const base = parseBaseNumber(file);
    if (base === null) return;

    if (!groups.has(base)) {
      groups.set(base, {
        main: null,
        contents: [],
        subtitles: [],
      });
    }

    const ext = path.extname(file).toLowerCase();
    const group = groups.get(base);

    if (VIDEO_EXT.has(ext)) {
      group.main = file;
    } else if (SUB_EXT.has(ext)) {
      group.subtitles.push(file);
    } else if (CONTENT_EXT.has(ext) && !group.main) {
      group.main = group.main || file;
    } else if (CONTENT_EXT.has(ext)) {
      group.contents.push(file);
    }
  });

  return groups;
};

const syncCourseDirectory = async (coursedirectory) => {
  const directory = normalizePath(coursedirectory);
  // First check if course directory exists
  if (!fs.existsSync(directory)) {
    const course = await Course.findOne({ where: { directory } });
    if (course) {
      // Delete all related data using cascade
      await course.destroy();
      console.log(`Deleted course: ${course.cleanedName}`);
    }
    return null;
  }

  // Get or create course
  let course = await Course.findOne({ where: { directory } });
  if (!course) {
    course = await Course.create({
      originalName: path.basename(directory),
      cleanedName: cleanNameCourse(path.basename(directory)),
      directory,
    });
    console.log("new course created");
  }

  // Get all section directories
  const currentSectionDirs = new Set(
    naturalSort(
      fs
        .readdirSync(directory)
        .filter((f) => fs.statSync(path.join(directory, f)).isDirectory())
    )
  );

  // Get existing sections from database
  const existingSections = await Section.findAll({
    where: { CourseId: course.id },
    include: [{ model: Lecture, as: "lectures" }],
  });

  // Remove sections that no longer exist in filesystem
  for (const section of existingSections) {
    const sectionPath = path.join(directory, section.originalName);
    if (!currentSectionDirs.has(section.originalName)) {
      await section.destroy();
      console.log(`Deleted section: ${section.cleanedName}`);
      continue;
    }

    // Check lectures in existing sections
    const files = naturalSort(fs.readdirSync(sectionPath));
    const fileGroups = groupFiles(files);
    const validLectureFiles = new Set(
      Array.from(fileGroups.values())
        .filter((group) => group.main)
        .map((group) => group.main)
    );

    // Remove lectures that no longer exist
    for (const lecture of section.lectures) {
      const lectureName = path.basename(lecture.path);
      if (!validLectureFiles.has(lectureName)) {
        await lecture.destroy();
        console.log(`Deleted lecture: ${lecture.cleanedName}`);
      }
    }
  }

  // Process all current sections
  for (const sectionDir of currentSectionDirs) {
    const sectionPath = path.join(directory, sectionDir);

    // Get or create section
    let section = await Section.findOne({
      where: {
        CourseId: course.id,
        originalName: sectionDir,
      },
    });

    if (!section) {
      section = await Section.create({
        originalName: sectionDir,
        cleanedName: cleanName(sectionDir),
        order: parseBaseNumber(sectionDir) || 0,
        CourseId: course.id,
      });
    }

    // Process files in section
    const files = naturalSort(fs.readdirSync(sectionPath));
    const fileGroups = groupFiles(files);

    for (const [base, group] of fileGroups) {
      if (
        !group.main ||
        (group.subtitles.length > 0 && !VIDEO_EXT.has(path.extname(group.main)))
      ) {
        continue;
      }

      const mainFile = group.main;
      const ext = path.extname(mainFile).toLowerCase();
      const isVideo = VIDEO_EXT.has(ext);
      const lectureType = isVideo
        ? "video"
        : path.extname(mainFile).replace(".", "");

      // Get or create lecture
      let lecture = await Lecture.findOne({
        where: {
          SectionId: section.id,
          originalName: mainFile,
        },
      });

      if (!lecture) {
        lecture = await Lecture.create({
          originalName: mainFile,
          cleanedName: cleanName(mainFile),
          order: base,
          type: lectureType,
          path: path.join(sectionPath, mainFile),
          SectionId: section.id,
        });
      }

      // Update lecture content and subtitles
      const content = group.contents.map((f) => ({
        type: path.extname(f).replace(".", ""),
        path: path.join(sectionPath, f),
        originalName: f,
        cleanedName: cleanName(f),
      }));

      const subtitles = group.subtitles.map((f) => {
        const langMatch = f.match(/\.([a-z]{2})\./i);
        return {
          language: langMatch ? langMatch[1] : "en",
          path: path.join(sectionPath, f),
          type: path.extname(f).replace(".", ""),
          originalName: f,
          cleanedName: cleanName(f),
        };
      });

      await lecture.update({
        content,
        subtitles,
        order: base,
      });
    }

    // Update section order if needed
    const newOrder = parseBaseNumber(sectionDir) || 0;
    if (section.order !== newOrder) {
      await section.update({ order: newOrder });
    }
  }

  return course;
};
const scanForDirectory = async (directory) =>
  new Set(
    naturalSort(
      fs
        .readdirSync(directory)
        .filter((f) => fs.statSync(path.join(directory, f)).isDirectory())
        .map((f) => path.join(directory, f))
    )
  );
router.post("/register", isAdminOrFirstStartUp, async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      role: "admin",
    });
    const folders = await Promise.all(
      req.body.folders.map(async (folder) => {
        const stats = await fsp.stat(folder);
        return {
          directory: normalizePath(folder),
          lastModified: stats.mtime,
          lastChecked: new Date(),
        };
      })
    );
    const coursefolder = await CourseFolder.bulkCreate(folders);
    const savedfolders = coursefolder.map((folder) => folder.directory);
    for (const folder of savedfolders) {
      const individualCourseDirectory = await scanForDirectory(folder);
      for (const individualCourse of individualCourseDirectory) {
        await syncCourseDirectory(normalizePath(individualCourse));
      }
    }
    const server = await Server.findAll();
    await server[0].update({ isFirstStartUp: false });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      res.json({ message: "Registration successful", user });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
});

router.post("/scan", isAdmin, async (req, res) => {
  try {
    const coursefolder = await CourseFolder.findAll();
    const savedfolders = coursefolder.map((folder) => folder.directory);
    for (const folder of savedfolders) {
      const individualCourseDirectory = await scanForDirectory(folder);

      for (const individualCourse of individualCourseDirectory) {
        await syncCourseDirectory(normalizePath(individualCourse));
      }
    }
  } catch (error) {
    res.status(500).send("Error updating the course");
    console.error(error);
  }
  res.status(201).send("succesfully updated the course");
});
router.post("/users", isAdmin, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
