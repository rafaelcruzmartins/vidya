import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs, { promises as fsp } from "fs";
import { Course, Instructor } from "../models/index.js";
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
    const { CourseId, CourseName, CategoryId, Instructors, description } =
      req.body;
    const parsedInstructor = JSON.parse(Instructors);

    if (req.file) {
      const randomName = crypto.randomBytes(16).toString("hex");
      const filename = `${randomName}.avif`;
      const outputPath = join(UPLOAD_DIR, filename);

      await sharp(req.file.buffer)
        .resize({
          height: 720,
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif(AVIF_CONFIG)
        .toFile(outputPath);

      const dbPath = `/assets/${filename}`;
      const course = await Course.findByPk(CourseId);

      if (course.photo) {
        const photoPath = join(__dirname, `../${course.photo}`);
        if (fs.existsSync(photoPath)) {
          await fsp.unlink(photoPath);
        }
      }
      await course.update({
        photo: dbPath,
        cleanedName: CourseName,
        CategoryId,
        description,
      });

      await course.setInstructors(parsedInstructor);
    } else {
      const course = await Course.findByPk(CourseId);

      await course.update({
        cleanedName: CourseName,
        CategoryId,
        description,
      });
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

const uploadImageInstructor = async (req, res) => {
  try {
    const { InstructorId, InstructorName, description } = req.body;
    if (req.file) {
      const randomName = crypto.randomBytes(16).toString("hex");
      const filename = `${randomName}.avif`;
      const outputPath = join(UPLOAD_DIR, filename);

      await sharp(req.file.buffer)
        .resize({
          height: 720,
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif(AVIF_CONFIG)
        .toFile(outputPath);

      const dbPath = `/assets/${filename}`;
      const instructor = await Instructor.findByPk(InstructorId);
      if (instructor.photo) {
        const photoPath = join(__dirname, `../${instructor.photo}`);
        if (fs.existsSync(photoPath)) {
          await fsp.unlink(photoPath);
        }
      }
      await instructor.update({
        photo: dbPath,
        name: InstructorName,
        description,
      });
    } else {
      await Instructor.update(
        {
          name: InstructorName,
          description,
        },
        { where: { id: InstructorId } }
      );
    }

    res.status(201).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { uploadImageCourse, uploadImageInstructor };
