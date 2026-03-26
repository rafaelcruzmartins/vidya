import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import {
  getAllInstructor,
  individualInstructor,
} from "../controllers/index.js";
const router = Router();

router.get("/", isAuthenticated, getAllInstructor);
router.post("/individual", isAuthenticated, individualInstructor);

export default router;
