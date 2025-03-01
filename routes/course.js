import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import cache from "../cache/nodecache.js";
import {
  Category,
  Course,
  Lecture,
  LectureProgress,
  Section,
  TrackingSystem,
  UserLastWatched,
  Instructor,
} from "../models/index.js";
import fs from "fs";
import path from "path";
const router = Router();
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const course = await Course.findAll();
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/player", isAuthenticated, async (req, res) => {
  try {
    const { CourseId } = req.body;
    const UserId = req.user.id;
    const courseData = await Course.findByPk(CourseId, {
      include: [
        {
          model: Section,
          as: "sections",
          attributes: ["id", "cleanedName", "order", "duration"],
          include: {
            model: Lecture,
            as: "lectures",
            attributes: [
              "id",
              "content",
              "type",
              "order",
              "cleanedName",
              "subtitles",
              "duration",
            ],
            include: {
              model: LectureProgress,
              as: "lectureprogresses",
              where: { UserId },
              attributes: ["hasCompleted", "progress"],
              required: false,
            },
          },
        },
        {
          model: UserLastWatched,
          as: "userlastwatcheds",
          where: { UserId },
          required: false,
        },
      ],
      order: [
        [{ model: Section, as: "sections" }, "order", "ASC"],
        [
          { model: Section, as: "sections" },
          { model: Lecture, as: "lectures" },
          "order",
          "ASC",
        ],
      ],
      attributes: ["id", "cleanedName", "description"],
    });

    res.json(courseData);
  } catch (error) {
    console.error(error);
  }
});
const getCourseData = async (CourseId) => {
  try {
    const [courseone, categories, instructor] = await Promise.all([
      Course.findByPk(CourseId, {
        include: [
          {
            model: Section,
            as: "sections",
            attributes: ["id", "cleanedName", "order", "duration"],
            include: {
              model: Lecture,
              as: "lectures",
              attributes: ["id", "type", "order", "cleanedName", "duration"],
            },
          },
          { model: Category, as: "category" },
          { model: Instructor, as: "instructors" },
        ],
        order: [
          [{ model: Section, as: "sections" }, "order", "ASC"],
          [
            { model: Section, as: "sections" },
            { model: Lecture, as: "lectures" },
            "order",
            "ASC",
          ],
        ],
        attributes: ["id", "cleanedName", "description", "photo", "duration"],
      }),
      Category.findAll(),
      Instructor.findAll(),
    ]);

    return {
      course: courseone || {},
      categories: categories || [],
      instructors: instructor || [],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch course data");
  }
};
router.post("/individual", isAuthenticated, async (req, res) => {
  try {
    const { CourseId } = req.body;
    const cachedCourse = cache.get(CourseId);
    if (cachedCourse) {
      res.json({ ...cachedCourse, role: req.user.role });
    } else {
      const courseData = await getCourseData(CourseId);
      cache.set(CourseId, courseData);
      res.json({ ...courseData, role: req.user.role });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch course data");
  }
});
router.post("/lectureprogress", isAuthenticated, async (req, res) => {
  const { lectureId, courseId } = req.body;
  const userId = req.user.id;
  try {
    const lectureprogress = await LectureProgress.findOne({
      where: { LectureId: lectureId, CourseId: courseId, UserId: userId },
    });
    res.json(lectureprogress);
  } catch (error) {
    console.error(error);
    res.status(404).send("progress not found");
  }
});
router.get("/stream/:LectureId", isAuthenticated, async (req, res) => {
  const { LectureId } = req.params;
  const lecture = await Lecture.findByPk(LectureId);
  const videoPath = lecture.path;

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0]);
    const end = parts[1] ? parseInt(parts[1]) : fileSize - 1;

    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(videoPath, { start, end });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    stream.pipe(res);
  } else {
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, headers);

    fs.createReadStream(videoPath).pipe(res);
  }
});
router.get("/download/:LectureId", isAuthenticated, async (req, res) => {
  try {
    const { LectureId } = req.params;
    const lecture = await Lecture.findByPk(LectureId);

    if (!lecture || !lecture.path) {
      return res.status(404).send("File not found");
    }
    const filePath = lecture.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    res.setHeader("Content-Length", fileSize);

    if (fileExtension === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      res.status(500).end();
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal server error");
  }
});
router.post(
  "/progress/lecturetogglecomplete",
  isAuthenticated,
  async (req, res) => {
    const { LectureId, CourseId } = req.body;
    try {
      await TrackingSystem.toggleLectureComplete(
        req.user.id,
        LectureId,
        CourseId
      );
      res.status(201).send("Lecture Progress Updated");
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
);
router.post(
  "/progress/lecturetogglenotcomplete",
  isAuthenticated,
  async (req, res) => {
    const { LectureId, CourseId } = req.body;
    try {
      await TrackingSystem.toggleLectureNotComplete(
        req.user.id,
        LectureId,
        CourseId
      );
      res.status(201).send("Lecture Progress Updated");
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
);

router.post("/progress/watchtime", isAuthenticated, async (req, res) => {
  const { seconds, lectureId, courseId, progress } = req.body;
  const userId = req.user.id;
  try {
    await TrackingSystem.updateWatchTime(
      userId,
      seconds,
      lectureId,
      progress,
      courseId
    );
    res.status(201).send("Lecture Progress Updated");
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

export default router;
