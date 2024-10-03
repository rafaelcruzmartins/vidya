import express, { json } from "express";
import sequelize from "./config/database.js";
import cors from "cors";
import {
  User,
  Course,
  Server,
  Section,
  Lecture,
  Progress,
} from "./models/index.js";
const app = express();
app.use(cors());
app.use(json());
// Sync all models with database
const syncdb = async () => {
  await sequelize.sync({ force: true });
  console.log("Database & tables created!");
  await User.create({ userName: "hello", password: "gajab" });
  await Server.create({ name: "VIDYA", isFirstStartUp: false });
  await Course.create({
    name: "CS 101",
    description: "CS 101 description",
    category: "Computer Science",
    instructorName: "Gajab",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: "/cs101/introduction/",
    hasCompleted: false,
  });
  await Section.create({ name: "Section 1", hasCompleted: false });
  await Lecture.create({
    name: "Lecture 1",
    url: "video.mp4",
    contentName: "notes.pdf",
    contentUrl: "notes.pdf",
    hasCompleted: false,
  });
};
syncdb();
app.get("/", async (req, res) => {
  const server = await Server.findAll();
  res.json(server);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
