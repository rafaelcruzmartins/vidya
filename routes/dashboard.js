import { Router } from "express";
import { getUserDashboardAnalytics } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/owner.js";

const router = Router();
router.get("/", isAuthenticated, getUserDashboardAnalytics);
export default router;
