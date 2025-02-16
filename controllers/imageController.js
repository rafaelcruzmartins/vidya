import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Course } from "../models/index.js";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "../assets");
const AVIF_CONFIG = {
  quality: 50,
  lossless: false,
  effort: 5,
};

const uploadImageCourse = async (req, res) => {
  try {
    const { CourseId, CourseName, CategoryId, Instructors } = req.body;
    const parsedInstructor = JSON.parse(Instructors);

    if (req.file) {
      const randomName = crypto.randomBytes(16).toString("hex");
      const filename = `${randomName}.avif`;
      const outputPath = join(UPLOAD_DIR, filename);

      await sharp(req.file.buffer).avif(AVIF_CONFIG).toFile(outputPath);

      const dbPath = `/assets/${filename}`;

      await Course.update(
        {
          photo: dbPath,
          cleanedName: CourseName,
          CategoryId,
        },
        { where: { id: CourseId } }
      );

      const course = await Course.findByPk(CourseId);
      await course.setInstructors(parsedInstructor);
    } else {
      await Course.update(
        {
          cleanedName: CourseName,
          CategoryId,
        },
        { where: { id: CourseId } }
      );
      const course = await Course.findByPk(CourseId);
      await course.setInstructors(parsedInstructor);
    }

    res.status(201).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { uploadImageCourse };
