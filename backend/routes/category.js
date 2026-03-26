import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import { allCategory, courseOfCategories } from "../controllers/index.js";
const router = Router();

router.get("/:limit", isAuthenticated, allCategory);
router.post("/course", isAuthenticated, courseOfCategories);

export default router;
