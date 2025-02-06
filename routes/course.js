import { Router } from "express";
import { isAuthenticated } from "../middleware/owner";
import { Course } from "../models/index";
const router = Router();

router.post("/", isAuthenticated, (req, res) => {
  const course = Course.findAll();
});
