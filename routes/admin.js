import { Router } from "express";
import { User } from "../models/index.js";
import { isAdmin } from "../middleware/owner.js";
const router = Router();
router.post("/users", isAdmin, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
