import { Router } from "express";
import { isAdminOrFirstStartUp, isAdmin } from "../middleware/owner.js";
import { upload } from "../utils/imageStorage.js";
import {
  uploadImageCourse,
  scan,
  register,
  createCategory,
  user,
  createInstructor,
  uploadImageInstructor,
} from "../controllers/index.js";
const router = Router();

router.post("/register", isAdminOrFirstStartUp, register);

router.post("/scan", isAdmin, scan);
router.post("/users", isAdmin, user);
router.post("/category", isAdmin, createCategory);
router.post("/instructor", isAdmin, createInstructor);
router.post("/form/course", isAdmin, upload.single("file"), uploadImageCourse);
router.post(
  "/form/instructor",
  isAdmin,
  upload.single("file"),
  uploadImageInstructor
);

export default router;
