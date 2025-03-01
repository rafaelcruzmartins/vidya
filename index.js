import express from "express";
import sequelize from "./config/database.js";
import crypto from "crypto";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import sessionConnect from "connect-session-sequelize";
import {
  User,
  Course,
  Server,
  Section,
  Lecture,
  LectureProgress,
} from "./models/index.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import driveRoutes from "./routes/drive.js";
import homeRoutes from "./routes/home.js";
import courseRoutes from "./routes/course.js";
import categoryRoutes from "./routes/category.js";
import instructorRoutes from "./routes/instructor.js";
const SequelizeStore = sessionConnect(session.Store);
const app = express();

// Sync all models with database
const syncdb = async () => {
  await sequelize.sync({ logging: false });
  console.log("Database & tables created!");

  await Server.findOrCreate({
    where: { name: "VIDYA" },
    defaults: { name: "VIDYA" },
  });
};
syncdb();

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        const dummySalt = crypto.randomBytes(16).toString("hex");
        crypto.pbkdf2Sync("dummypassword", dummySalt, 1000, 64, "sha512");
        return done(null, false, { message: "Invalid credentials" });
      }

      let isPasswordValid;
      try {
        const inputHash = crypto
          .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
          .toString("hex");

        isPasswordValid = crypto.timingSafeEqual(
          Buffer.from(inputHash),
          Buffer.from(user.password)
        );
      } catch (err) {
        return done(err);
      }

      if (!isPasswordValid) {
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  "/assets",
  express.static("assets", {
    maxAge: "1y",
  })
);
app.use(
  session({
    secret: "your-secret-key",
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/instructor", instructorRoutes);
app.get("/", async (req, res) => {
  const server = await Server.findAll();
  res.status(200).json(server[0].isFirstStartUp);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
