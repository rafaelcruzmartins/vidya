import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import { getHiddenCourseIds } from "../utils/hiddenCourses.js";
import {
  Course,
  CourseProgress,
  Instructor,
  Lecture,
  Section,
  TrackingSystem,
} from "../models/index.js";
const router = Router();
const getUserData = async (userId, featuredCourseId) => {
  try {
    const ocultos = await getHiddenCourseIds(userId);
    const [lastWatched, watchTime, featuredCourse, latestCourse] =
      await Promise.all([
        CourseProgress.findAll({
          where: { UserId: userId, hasCompleted: false },
          include: [
            {
              model: Lecture,
              as: "lecture",
              attributes: ["cleanedName"],
            },
            {
              model: Course,
              as: "course",
              attributes: ["cleanedName", "id", "photo"],
            },
          ],
          order: [["updatedAt", "DESC"]],
        }),
        TrackingSystem.getCategoryWatchTime(userId),
        Course.findByPk(featuredCourseId, {
          attributes: ["id", "cleanedName", "photo"],
          include: [
            {
              model: Instructor,
              as: "instructors",
              attributes: ["id", "name"],
            },
          ],
        }),
        Course.findAll({
          order: [["createdAt", "DESC"]],
          limit: 10,
          attributes: ["id", "cleanedName", "photo", "createdAt", "duration"],
          include: [
            {
              model: Instructor,
              as: "instructors",
            },
          ],
        }),
      ]);

    // Sem capa, o cartão precisa de números para ter o que mostrar: quantas
    // seções e aulas o curso tem, e quanto dele já foi assistido.
    const visiveis = latestCourse.filter((c) => !ocultos.has(c.id));
    const courseIds = visiveis.map((c) => c.id);
    const [sections, progressos, streak] = await Promise.all([
      Section.findAll({
        where: { CourseId: courseIds },
        attributes: ["id", "CourseId"],
        include: [{ model: Lecture, as: "lectures", attributes: ["id"] }],
      }),
      CourseProgress.findAll({
        where: { UserId: userId, CourseId: courseIds },
        attributes: ["CourseId", "progress", "hasCompleted"],
      }),
      TrackingSystem.getWatchStreak(userId),
    ]);

    const resumoPorCurso = new Map();
    for (const section of sections) {
      const atual = resumoPorCurso.get(section.CourseId) || {
        sections: 0,
        lectures: 0,
      };
      atual.sections += 1;
      atual.lectures += section.lectures?.length || 0;
      resumoPorCurso.set(section.CourseId, atual);
    }

    const progressoPorCurso = new Map(
      progressos.map((p) => [p.CourseId, p.progress || 0]),
    );

    const latestCourseComResumo = visiveis.map((course) => {
      const resumo = resumoPorCurso.get(course.id) || {
        sections: 0,
        lectures: 0,
      };
      return {
        ...course.toJSON(),
        sectionCount: resumo.sections,
        lectureCount: resumo.lectures,
        progress: progressoPorCurso.get(course.id) || 0,
      };
    });

    return {
      continueWatching: (lastWatched || []).filter(
        (item) => item.course && !ocultos.has(item.course.id),
      ),
      categoryWatchTime: watchTime || {},
      featuredCourse:
        featuredCourse && !ocultos.has(featuredCourse.id)
          ? featuredCourse
          : null,
      latestCourse: latestCourseComResumo,
      stats: {
        courseCount: visiveis.length,
        lectureCount: latestCourseComResumo.reduce(
          (soma, c) => soma + c.lectureCount,
          0,
        ),
        streak: streak || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw new Error("Failed to fetch home data");
  }
};
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const homeData = await getUserData(req.user.id, req.user.featuredCourse);
    res.json(homeData);
  } catch (error) {
    // Sem esta resposta a requisição fica pendurada até o navegador desistir,
    // e a tela inicial nunca sai do carregando.
    console.error(error);
    res.status(500).json({ error: "Failed to fetch home data" });
  }
});

export default router;
