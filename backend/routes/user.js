import { Router } from "express";
import { removeTag } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/owner.js";
import { Course, HiddenCourse } from "../models/index.js";
const router = Router();

router.post("/remove-tag", isAuthenticated, removeTag);

// Catálogo completo com a marca de oculto de quem está pedindo. Serve a tela
// de configurações, que precisa listar inclusive o que está escondido.
router.get("/course-visibility", isAuthenticated, async (req, res) => {
  try {
    const [courses, hidden] = await Promise.all([
      Course.findAll({
        attributes: ["id", "cleanedName"],
        order: [["cleanedName", "ASC"]],
      }),
      HiddenCourse.findAll({
        where: { UserId: req.user.id },
        attributes: ["CourseId"],
      }),
    ]);

    const ocultos = new Set(hidden.map((h) => h.CourseId));

    res.json(
      courses.map((course) => ({
        id: course.id,
        cleanedName: course.cleanedName,
        hidden: ocultos.has(course.id),
      })),
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/course-visibility", isAuthenticated, async (req, res) => {
  try {
    const { courseId, hidden } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "courseId é obrigatório" });
    }

    const course = await Course.findByPk(courseId, { attributes: ["id"] });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (hidden) {
      await HiddenCourse.findOrCreate({
        where: { UserId: req.user.id, CourseId: courseId },
      });
    } else {
      await HiddenCourse.destroy({
        where: { UserId: req.user.id, CourseId: courseId },
      });
    }

    res.json({ courseId, hidden: Boolean(hidden) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
