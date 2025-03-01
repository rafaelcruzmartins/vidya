import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import {
  Category,
  Course,
  Lecture,
  TrackingSystem,
  UserLastWatched,
} from "../models/index.js";
const router = Router();
const getUserData = async (userId, featuredCourseId) => {
  try {
    const [lastWatched, watchTime, featuredCourse, latestCourse, category] =
      await Promise.all([
        UserLastWatched.findAll({
          where: { UserId: userId },
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
        }),
        TrackingSystem.getCategoryWatchTime(userId),
        Course.findByPk(featuredCourseId, {
          attributes: ["id", "title", "photo"],
        }),
        Course.findAll({
          order: [["createdAt", "DESC"]],
          limit: 10,
          attributes: ["id", "cleanedName", "photo"],
        }),
        Category.findAll({ limit: 6 }),
      ]);

    return {
      continueWatching: lastWatched || [],
      categoryWatchTime: watchTime || {},
      featuredCourse: featuredCourse || null,
      latestCourse: latestCourse || [],
      category: category || [],

      hasIncompleteData:
        !lastWatched || !watchTime || !featuredCourse || !latestCourse,
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
    console.error(error);
  }
});

export default router;
