import { Router } from "express";
import { User } from "../models/index.js";
import { isAlreadyAdmin } from "../middleware/owner.js";
import passport from "passport";
const router = Router();

router.post("/register", isAlreadyAdmin, async (req, res) => {
  try {
    const user = await User.create({ ...req.body, role: "admin" });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      res.json({ message: "Registration successful", user });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out" }));
});

router.get("/user", (req, res) => {
  req.user
    ? res.json(req.user)
    : res.status(401).json({ error: "Not authenticated" });
});

export default router;
