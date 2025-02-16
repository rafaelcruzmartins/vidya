import { User, Server } from "../models/index.js";
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.role === "admin") return next();
    res.status(403).json({ error: "Admin access required" });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Admin access required" });
  }
};
const isAdminOrFirstStartUp = async (req, res, next) => {
  try {
    const result = await Server.findAll();
    if (result[0].isFirstStartUp || req.user.role === "admin") {
      return next();
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Admin access required" });
  }
};

const isOwnerOrAdmin = (model) => async (req, res, next) => {
  try {
    const record = await model.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found" });
    if (req.user.role === "admin" || record.userId === req.user.id)
      return next();
    res.status(403).json({ error: "Access denied" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export { isAdmin, isAuthenticated, isOwnerOrAdmin, isAdminOrFirstStartUp };
