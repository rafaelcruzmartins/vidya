import { Router } from "express";
import passport from "passport";
const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/logout", (req, res) => {
  try {
    req.logout(() => res.json({ message: "Logged out" }));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user", (req, res) => {
  try {
    req.user
      ? res.json({
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
        })
      : res.status(401).json({ error: "Not authenticated" });
  } catch (error) {
    res.status(500).send("internal server error");
    console.error(error);
  }
});

export default router;
