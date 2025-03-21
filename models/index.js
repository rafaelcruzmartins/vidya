import User from "./User.js";
import Server from "./Server.js";
import Course from "./Course.js";
import Section from "./Section.js";
import Lecture from "./Lecture.js";
import LectureProgress from "./LectureProgress.js";
import CourseFolder from "./CourseFolder.js";
import Category from "./Category.js";
import DailyWatch from "./DailyWatch.js";
import Instructor from "./Instructor.js";
import PathFile from "./PathFile.js";
import TagsAndBookmark from "./TagsAndBookmark.js";
import CourseProgress from "./CourseProgress.js";
import sequelize from "../config/database.js";

CourseFolder.hasMany(Course, { foreignKey: "CourseFolderId", as: "courses" });
Course.belongsTo(CourseFolder, {
  foreignKey: "CourseFolderId",
  as: "coursefolder",
});
Course.hasMany(Section, {
  foreignKey: "CourseId",
  as: "sections",
  onDelete: "CASCADE",
  hooks: true,
});
Section.belongsTo(Course, { foreignKey: "CourseId", as: "course" });
Section.hasMany(Lecture, {
  foreignKey: "SectionId",
  as: "lectures",
  onDelete: "CASCADE",
  hooks: true,
});
Lecture.belongsTo(Section, { foreignKey: "SectionId", as: "section" });
Category.hasMany(Course, { foreignKey: "CategoryId", as: "courses" });
Course.belongsTo(Category, { foreignKey: "CategoryId", as: "category" });
const CourseIntructor = sequelize.define("CourseInstructor", {});
Instructor.belongsToMany(Course, {
  through: "CourseInstructor",
  as: "courses",
});
Course.belongsToMany(Instructor, {
  through: "CourseInstructor",
  as: "instructors",
});

User.hasMany(TagsAndBookmark, {
  foreignKey: "UserId",
  as: "tagsandbookmarks",
  onDelete: "CASCADE",
  hooks: true,
});
TagsAndBookmark.belongsTo(User, { foreignKey: "UserId", as: "user" });
Lecture.hasMany(LectureProgress, {
  foreignKey: "LectureId",
  as: "lectureprogresses",
  onDelete: "CASCADE",
  hooks: true,
});
LectureProgress.belongsTo(Lecture, { foreignKey: "LectureId", as: "lecture" });
User.hasMany(LectureProgress, {
  foreignKey: "UserId",
  as: "lectureprogresses",
  onDelete: "CASCADE",
  hooks: true,
});
LectureProgress.belongsTo(User, { foreignKey: "UserId", as: "user" });
Course.hasMany(LectureProgress, {
  foreignKey: "CourseId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(Course, { foreignKey: "CourseId", as: "course" });

User.hasMany(DailyWatch, {
  foreignKey: "UserId",
  as: "dailywatches",
  onDelete: "CASCADE",
  hooks: true,
});
DailyWatch.belongsTo(User, { foreignKey: "UserId", as: "user" });

User.hasMany(CourseProgress, {
  foreignKey: "UserId",
  as: "courseprogresses",
  onDelete: "CASCADE",
  hooks: true,
});
CourseProgress.belongsTo(User, { foreignKey: "UserId", as: "user" });

Course.hasMany(CourseProgress, {
  foreignKey: "CourseId",
  as: "courseprogresses",
  onDelete: "CASCADE",
  hooks: true,
});
CourseProgress.belongsTo(Course, { foreignKey: "CourseId", as: "course" });

Lecture.hasMany(CourseProgress, {
  foreignKey: "LectureId",
  as: "courseprogresses",
});
CourseProgress.belongsTo(Lecture, { foreignKey: "LectureId", as: "lecture" });

const transformWatchtimeData = (data, maxCategories = 5) => {
  const result = {
    totalWatchtime: 0,
    categoryWatchtime: [],
  };

  const categoryMap = new Map();
  let othersWatchtime = 0;

  data.forEach((entry) => {
    result.totalWatchtime += entry.totalWatchTime;

    const categoryName =
      entry.course.CategoryId && entry.course.category
        ? entry.course.category.category
        : null;

    if (categoryName === null) {
      othersWatchtime += entry.totalWatchTime;
    } else {
      if (categoryMap.has(categoryName)) {
        categoryMap.set(
          categoryName,
          categoryMap.get(categoryName) + entry.totalWatchTime
        );
      } else {
        categoryMap.set(categoryName, entry.totalWatchTime);
      }
    }
  });

  const sortedCategories = Array.from(categoryMap).sort((a, b) => b[1] - a[1]);

  const topCategories = sortedCategories.slice(0, maxCategories);

  if (sortedCategories.length > maxCategories) {
    for (let i = maxCategories; i < sortedCategories.length; i++) {
      othersWatchtime += sortedCategories[i][1];
    }
  }

  result.categoryWatchtime = topCategories.map(([category, watchtime]) => ({
    category,
    watchtime,
  }));

  if (othersWatchtime > 0) {
    result.categoryWatchtime.push({
      category: "Others",
      watchtime: othersWatchtime,
    });
  }

  return result;
};
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

    const [courseprogress] = await CourseProgress.findOrCreate({
      where: {
        CourseId: courseId,
        UserId: userId,
      },
    });
    courseprogress.update({ LectureId: lectureId });
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
  async updateCourseProgress(UserId, CourseId, progress, hasCompleted) {
    const [courseprogress] = await CourseProgress.findOrCreate({
      where: {
        UserId,
        CourseId,
      },
    });

    await courseprogress.update({ hasCompleted, progress });
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
    const categoryWatchTime = await LectureProgress.findAll({
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
      group: ["course.CategoryId", "course.category.id"],
      raw: true,
      nest: true,
    });

    return transformWatchtimeData(categoryWatchTime);
  },
};

export {
  User,
  Server,
  Course,
  Section,
  Lecture,
  CourseFolder,
  LectureProgress,
  Category,
  Instructor,
  DailyWatch,
  PathFile,
  TagsAndBookmark,
  CourseProgress,
  TrackingSystem,
};
