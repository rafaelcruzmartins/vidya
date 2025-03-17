import { Op } from "sequelize";
import sequelize from "../config/database.js";
import {
  CourseProgress,
  Course,
  TagsAndBookmark,
  DailyWatch,
  LectureProgress,
  Category,
  Lecture,
} from "../models/index.js";

export const getUserDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [watchData, courseData, tagsAndBookmarks, lectureWatchData] =
      await Promise.all([
        DailyWatch.findAll({
          where: {
            UserId: userId,
            date: {
              [Op.gte]: sequelize.literal("date('now', '-30 days')"),
            },
          },
          attributes: ["date", "watchTimeSeconds"],
          order: [["date", "DESC"]],
        }),

        CourseProgress.findAll({
          where: {
            UserId: userId,
          },
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "cleanedName"],
            },
          ],
          order: [["updatedAt", "DESC"]],
        }),

        TagsAndBookmark.findAll({
          where: {
            UserId: userId,
          },
        }),

        LectureProgress.findAll({
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
        }),
      ]);

    const totalCourses = await Course.count();

    const result = {
      recentCoursesProgress: processRecentCourses(courseData),
      courseCompletionStats: processCourseStats(courseData, totalCourses),
      weeklyWatchTime: processWeeklyWatchTime(watchData, startOfWeek),
      tagsAndBookmarks: processTagsAndBookmarks(tagsAndBookmarks),
      watchStreak: calculateWatchStreak(watchData, today),
      categoryWatchTime: transformWatchtimeData(lectureWatchData),
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
      error: error.message,
    });
  }
};

const processRecentCourses = (courseData) => {
  return courseData.filter((course) => !course.hasCompleted).slice(0, 3);
};

const processCourseStats = (courseData, totalCourses) => {
  const completedCourses = new Set(
    courseData
      .filter((course) => course.hasCompleted)
      .map((course) => course.CourseId)
  ).size;
  const currentlyWatching = new Set(
    courseData.filter((course) => !course.hasCompleted)
  ).size;
  return {
    totalCourses,
    completedCourses,
    currentlyWatching,
  };
};

const processWeeklyWatchTime = (watchData, startOfWeek) => {
  const weeklyWatchData = watchData.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= startOfWeek;
  });

  const totalWatchTimeSeconds = weeklyWatchData.reduce(
    (sum, record) => sum + record.watchTimeSeconds,
    0
  );

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const watchTimeByDay = {};
  daysOfWeek.forEach((day) => {
    watchTimeByDay[day] = 0;
  });

  weeklyWatchData.forEach((record) => {
    const recordDate = new Date(record.date);
    const dayName = daysOfWeek[recordDate.getDay()];
    watchTimeByDay[dayName] += record.watchTimeSeconds;
  });

  return {
    totalWatchTimeSeconds,
    totalWatchTimeFormatted: formatTime(totalWatchTimeSeconds),
    watchTimeByDay,
    formattedWatchTimeByDay: Object.entries(watchTimeByDay).reduce(
      (acc, [day, seconds]) => {
        acc[day] = formatTime(seconds);
        return acc;
      },
      {}
    ),
  };
};

const processTagsAndBookmarks = (tagsData) => {
  const tagTypes = ["bookmark", "difficult", "need-review", "important"];
  const groupedTags = {};

  tagTypes.forEach((type) => {
    groupedTags[type] = tagsData.filter((tag) => tag.type === type);
  });

  return groupedTags;
};

const calculateWatchStreak = (watchData, today) => {
  let streak = 0;
  let currentDate = new Date(today.toISOString().split("T")[0]);

  for (const stat of watchData) {
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
};

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
    percentage: Math.round((watchtime / result.totalWatchtime) * 100),
  }));

  if (othersWatchtime > 0) {
    result.categoryWatchtime.push({
      category: "Others",
      watchtime: othersWatchtime,
      percentage: Math.round((othersWatchtime / result.totalWatchtime) * 100),
    });
  }

  return result;
};

const formatTime = (duration) => {
  if (duration < 60) {
    return `${duration} sec`;
  } else if (duration < 3600) {
    const minutes = (duration / 60).toFixed(1);
    return `${minutes} min`;
  } else {
    const hours = (duration / 3600).toFixed(1);
    return `${hours} hrs`;
  }
};

export default getUserDashboardAnalytics;
