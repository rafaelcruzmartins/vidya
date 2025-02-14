import User from "./User.js";
import Server from "./Server.js";
import Course from "./Course.js";
import Section from "./Section.js";
import Lecture from "./Lecture.js";
import LectureProgress from "./LectureProgress.js";
import CourseFolder from "./CourseFolder.js";
import UserLastWatched from "./UserLastWatched.js";
import Category from "./Category.js";
import DailyWatch from "./DailyWatch.js";
import Instructor from "./Instructor.js";
import sequelize from "../config/database.js";

Course.hasMany(Section, { foreignKey: "CourseId", as: "sections" });
Section.belongsTo(Course, { foreignKey: "CourseId", as: "course" });
Section.hasMany(Lecture, { foreignKey: "SectionId", as: "lectures" });
Lecture.belongsTo(Section, { foreignKey: "SectionId", as: "section" });
Category.hasMany(Course, { foreignKey: "CategoryId", as: "courses" });
Course.belongsTo(Category, { foreignKey: "CategoryId", as: "category" });
Instructor.hasMany(Course, { foreignKey: "CourseId", as: "courses" });
Course.belongsTo(Instructor, { foreignKey: "CourseId", as: "instructor" });

User.hasMany(UserLastWatched, { foreignKey: "UserId", as: "userlastwatcheds" });
UserLastWatched.belongsTo(User, { foreignKey: "UserId", as: "user" });
Course.hasMany(UserLastWatched, {
  foreignKey: "CourseId",
  as: "userlastwatcheds",
});
UserLastWatched.belongsTo(Course, { foreignKey: "CourseId", as: "course" });
Lecture.hasMany(UserLastWatched, {
  foreignKey: "LectureId",
  as: "userlastwatcheds",
});
UserLastWatched.belongsTo(Lecture, { foreignKey: "LectureId", as: "lecture" });
Lecture.hasMany(LectureProgress, {
  foreignKey: "LectureId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(Lecture, { foreignKey: "LectureId", as: "lecture" });
User.hasMany(LectureProgress, {
  foreignKey: "UserId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(User, { foreignKey: "UserId", as: "user" });
Course.hasMany(LectureProgress, {
  foreignKey: "CourseId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(Course, { foreignKey: "CourseId", as: "course" });

User.hasMany(DailyWatch, { foreignKey: "UserId", as: "dailywatches" });
DailyWatch.belongsTo(User, { foreignKey: "UserId", as: "user" });

const TrackingSystem = {
  async updateWatchTime(userId, seconds, lectureId, progress, courseId) {
    const today = new Date().toISOString().split("T")[0];

    const [dailyWatch] = await DailyWatch.findOrCreate({
      where: { date: today, UserId: userId },
      defaults: { watchTimeSeconds: 0 },
    });
    await dailyWatch.increment("watchTimeSeconds", { by: seconds });

    const [lectureprogresses] = await LectureProgress.findOrCreate({
      where: {
        LectureId: lectureId,
        UserId: userId,
        CourseId: courseId,
      },
      defaults: { watchTime: 0 },
    });
    await lectureprogresses.update({
      progress,
      watchTime: lectureprogresses.watchTime + seconds,
    });

    const [userlastwatched] = await UserLastWatched.findOrCreate({
      where: {
        CourseId: courseId,
        UserId: userId,
      },
    });
    userlastwatched.update({ LectureId: lectureId });
  },

  async toggleLectureComplete(userId, lectureId, courseId) {
    const [lectureprogresses] = await LectureProgress.findOrCreate({
      where: {
        LectureId: lectureId,
        UserId: userId,
        CourseId: courseId,
      },
    });
    await lectureprogresses.update({ hasCompleted: true, progress: 0 });
  },
  async toggleLectureNotComplete(userId, lectureId, courseId) {
    const [lectureprogresses] = await LectureProgress.findOrCreate({
      where: {
        LectureId: lectureId,
        UserId: userId,
        CourseId: courseId,
      },
    });
    await lectureprogresses.update({ hasCompleted: false, progress: 0 });
  },
  async getWatchStreak(userId) {
    const today = new Date().toISOString().split("T")[0];

    const stats = await DailyWatch.findAll({
      where: {
        UserId: userId,
        date: {
          [Op.gte]: sequelize.literal("date('now', '-30 days')"),
        },
      },
      order: [["date", "DESC"]],
    });

    let streak = 0;
    let currentDate = new Date(today);

    for (const stat of stats) {
      const statDate = new Date(stat.date);
      const diffDays = Math.floor(
        (currentDate - statDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        streak++;
        currentDate = statDate;
      } else {
        break;
      }
    }

    return streak;
  },

  async getCategoryWatchTime(userId) {
    return await LectureProgress.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("watchTime")), "totalWatchTime"],
      ],
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["CategoryId"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category"],
            },
          ],
        },
      ],
      where: {
        UserId: userId,
      },
      group: ["Course.CategoryId", "Course.category.category"],
    });
  },

  async getCourseProgress(userId, courseId) {
    const totalLectures = await Lecture.count({
      include: [
        {
          model: Section,
          as: "section",
          where: { CourseId: courseId },
        },
      ],
    });

    const completedLectures = await LectureProgress.count({
      where: {
        UserId: userId,
        CourseId: courseId,
        hasCompleted: true,
      },
    });

    return {
      total: totalLectures,
      completed: completedLectures,
      percentage: (completedLectures / totalLectures) * 100,
    };
  },

  async getCurrentlyWatchingCourses(userId) {
    return await Course.findAll({
      include: [
        {
          model: LectureProgress,
          as: "lectureprogresses",
          where: {
            UserId: userId,
            hasCompleted: false,
          },
          required: true,
        },
      ],
      group: ["Course.id"],
      having: sequelize.literal("COUNT(lectureprogresses.id) > 0"),
    });
  },

  async getCompletedCourses(userId) {
    const courses = await Course.findAll({
      include: [
        {
          model: Section,
          as: "sections",
          include: [
            {
              model: Lecture,
              as: "lectures",
            },
          ],
        },
        {
          model: LectureProgress,
          as: "lectureprogresses",
          where: {
            UserId: userId,
            hasCompleted: true,
          },
        },
      ],
      group: ["Course.id"],
    });

    return courses.filter((course) => {
      const totalLectures = course.sections.reduce(
        (sum, section) => sum + section.lectures.length,
        0
      );
      return course.lectureprogresses.length === totalLectures;
    });
  },
};

export {
  User,
  Server,
  Course,
  Section,
  Lecture,
  CourseFolder,
  UserLastWatched,
  LectureProgress,
  Category,
  DailyWatch,
  TrackingSystem,
};
