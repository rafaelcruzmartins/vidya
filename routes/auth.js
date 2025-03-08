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
  try {
    req.user
      ? res.json({ id: req.user.id, username: req.user.username })
      : res.status(401).json({ error: "Not authenticated" });
  } catch (error) {
    res.status(500).send("internal server error");
    console.error(error);
  }
});

export default router;
