import { register, scan } from "./courseController.js";
import { user } from "./userController.js";
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
  user,
  uploadImageCourse,
  uploadImageInstructor,
  createCategory,
  createInstructor,
  allCategory,
  courseOfCategories,
  getAllInstructor,
  individualInstructor,
  getUserDashboardAnalytics,
};
