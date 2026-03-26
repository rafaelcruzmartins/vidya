import { Op } from "sequelize";
import {
  Course,
  Section,
  Lecture,
  Instructor,
  Category,
} from "../models/index.js";

export const advancedSearch = async (query, limit = 5) => {
  if (!query || query.trim() === "") {
    return {
      courses: [],
      sections: [],
      lectures: [],
      instructors: [],
      categories: [],
    };
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searchPattern = `%${normalizedQuery}%`;

  try {
    const [courses, sections, lectures, instructors, categories] =
      await Promise.all([
        Course.findAll({
          where: {
            [Op.or]: [
              { originalName: { [Op.like]: searchPattern } },
              { cleanedName: { [Op.like]: searchPattern } },
            ],
          },
          attributes: ["id", "cleanedName"],
          limit,
        }),

        Section.findAll({
          where: {
            [Op.or]: [
              { originalName: { [Op.like]: searchPattern } },
              { cleanedName: { [Op.like]: searchPattern } },
            ],
          },
          attributes: ["id", "cleanedName", "CourseId"],
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "cleanedName"],
            },
          ],
          limit,
        }),

        Lecture.findAll({
          where: {
            [Op.or]: [
              { originalName: { [Op.like]: searchPattern } },
              { cleanedName: { [Op.like]: searchPattern } },
            ],
          },
          attributes: ["id", "cleanedName"],
          include: [
            {
              model: Section,
              as: "section",
              attributes: ["id", "CourseId"],
              include: [
                {
                  model: Course,
                  as: "course",
                  attributes: ["id", "cleanedName"],
                },
              ],
            },
          ],
          limit,
        }),

        Instructor.findAll({
          where: {
            name: { [Op.like]: searchPattern },
          },
          attributes: ["id", "name"],
          limit,
        }),

        Category.findAll({
          where: {
            category: { [Op.like]: searchPattern },
          },
          attributes: ["id", "category"],
          limit,
        }),
      ]);

    return {
      courses: courses.map((course) => ({
        id: course.id,
        name: course.cleanedName,

        type: "course",
      })),

      sections: sections.map((section) => ({
        id: section.id,
        name: section.cleanedName,
        courseId: section.CourseId,
        courseName: section.course ? section.course.cleanedName : null,
        type: "section",
      })),

      lectures: lectures.map((lecture) => {
        const courseId = lecture.section?.CourseId || null;
        const courseName = lecture.section?.course?.cleanedName || null;

        return {
          id: lecture.id,
          name: lecture.cleanedName,
          courseId: courseId,
          courseName: courseName,

          type: "lecture",
        };
      }),

      instructors: instructors.map((instructor) => ({
        id: instructor.id,
        name: instructor.name,
        type: "instructor",
      })),

      categories: categories.map((category) => ({
        id: category.id,
        name: category.category,
        type: "category",
      })),
    };
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("An error occurred during search. Please try again.");
  }
};

export const doSearch = async (req, res) => {
  const { query, limit } = req.query;
  try {
    const results = await advancedSearch(query, limit);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
