import {
  register,
  scan,
  addCourseFolder,
  deleteFolder,
} from "./courseController.js";
import { createUser, getAdminData } from "./adminController.js";
import { uploadImageCourse, uploadImageInstructor } from "./imageController.js";
import {
  createCategory,
  allCategory,
  courseOfCategories,
} from "./categoryController.js";
import {
  createInstructor,
  getAllInstructor,
  individualInstructor,
} from "./instructorController.js";

import getUserDashboardAnalytics from "./dashboardController.js";

export {
  register,
  scan,
  createUser,
  getAdminData,
  uploadImageCourse,
  uploadImageInstructor,
  createCategory,
  createInstructor,
  allCategory,
  courseOfCategories,
  getAllInstructor,
  individualInstructor,
  addCourseFolder,
  getUserDashboardAnalytics,
  deleteFolder,
};
