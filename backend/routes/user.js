import { Router } from "express";
import { removeTag } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/owner.js";
const router = Router();

router.post("/remove-tag", isAuthenticated, removeTag);
export default router;
