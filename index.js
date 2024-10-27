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
const courseData = {
  courseTitle: "Complete Web Development Bootcamp 2024",
  courseDuration: "32 hours",
  instructor: "Sarah Johnson",
  sections: [
    {
      sectionId: 1,
      title: "Getting Started with Web Development",
      duration: "4 hours",
      lectures: [
        {
          lectureId: "1.1",
          title: "Course Introduction",
          duration: "10:15",
          videoUrl:
            "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
          isComplete: false,
        },
        {
          lectureId: "1.2",
          title: "Setting Up Your Development Environment",
          duration: "25:30",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          isComplete: false,
        },
        {
          lectureId: "1.3",
          title: "HTML Fundamentals",
          duration: "45:20",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          isComplete: false,
        },
      ],
    },
    {
      sectionId: 2,
      title: "CSS Fundamentals",
      duration: "6 hours",
      lectures: [
        {
          lectureId: "2.1",
          title: "CSS Selectors and Properties",
          duration: "38:45",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          isComplete: false,
        },
        {
          lectureId: "2.2",
          title: "Flexbox Layout",
          duration: "55:00",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          isComplete: false,
        },
        {
          lectureId: "2.3",
          title: "CSS Grid Layout",
          duration: "50:30",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          isComplete: false,
        },
      ],
    },
    {
      sectionId: 3,
      title: "JavaScript Basics",
      duration: "8 hours",
      lectures: [
        {
          lectureId: "3.1",
          title: "Variables and Data Types",
          duration: "42:15",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          isComplete: false,
        },
        {
          lectureId: "3.2",
          title: "Functions and Scope",
          duration: "48:20",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          isComplete: false,
        },
        {
          lectureId: "3.3",
          title: "DOM Manipulation",
          duration: "52:10",
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          isComplete: false,
        },
      ],
    },
  ],
  totalLectures: 9,
  lastUpdated: "2024-03-15",
  courseProgress: 0,
};
app.get("/", async (req, res) => {
  const server = await Server.findAll();
  res.json(server);
});
app.get("/data", async (req, res) => {
  res.json(courseData);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
