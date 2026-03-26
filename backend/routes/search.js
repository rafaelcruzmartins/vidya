import { Router } from "express";
import { isAuthenticated } from "../middleware/owner.js";
import { doSearch } from "../controllers/index.js";
const router = Router();

router.get("/", isAuthenticated, doSearch);
export default router;
