import { Router } from "express";
import { isAdminOrFirstStartUp, isAdmin } from "../middleware/owner.js";
import { upload } from "../utils/imageStorage.js";
import {
  uploadImageCourse,
  scan,
  register,
  category,
  user,
  instructor,
} from "../controllers/index.js";
const router = Router();

router.post("/register", isAdminOrFirstStartUp, register);

router.post("/scan", isAdmin, scan);
router.post("/users", isAdmin, user);
router.post("/category", isAdmin, category);
router.post("/instructor", isAdmin, instructor);
router.post("/form/course", isAdmin, upload.single("file"), uploadImageCourse);

export default router;
