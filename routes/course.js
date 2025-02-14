import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import {
  Course,
  Lecture,
  LectureProgress,
  Section,
  TrackingSystem,
  UserLastWatched,
} from "../models/index.js";
import fs from "fs";
import { where } from "sequelize";
const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const course = await Course.findAll();
    res.json(course);
  } catch (error) {
    console.error(error);
  }
});

router.post("/individual", isAuthenticated, async (req, res) => {
  try {
    const { CourseId } = req.body;
    const UserId = req.user.id;
    const courseData = await Course.findByPk(CourseId, {
      include: [
        {
          model: Section,
          as: "sections",
          attributes: ["id", "cleanedName", "order"],
          include: {
            model: Lecture,
            as: "lectures",
            attributes: ["id", "content", "type", "order", "cleanedName"],
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
