import { Router } from "express";
import passport from "passport";
const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out" }));
});

router.get("/user", (req, res) => {
  req.user
    ? res.json(req.user)
    : res.status(401).json({ error: "Not authenticated" });
});

export default router;
