import { join } from "path";
import sharp from "sharp";
import fs, { promises as fsp } from "fs";
import { Course, Instructor } from "../models/index.js";
import crypto from "crypto";
import { ASSETS_PATH } from "../config/path.js";

const UPLOAD_DIR = ASSETS_PATH;
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
        const photoPath = join(
          ASSETS_PATH,
          course.photo.replace("/assets/", ""),
        );
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
        const photoPath = join(
          ASSETS_PATH,
          instructor.photo.replace("/assets/", ""),
        );
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
        { where: { id: InstructorId } },
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
