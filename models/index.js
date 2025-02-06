import User from "./User.js";
import Server from "./Server.js";
import Course from "./Course.js";
import Section from "./Section.js";
import Lecture from "./Lecture.js";
import LectureProgress from "./LectureProgress.js";
import CourseFolder from "./CourseFolder.js";
import UserLastWatched from "./UserLastWatched.js";

Course.hasMany(Section, { foreignKey: "CourseId", as: "sections" });
Section.belongsTo(Course, { foreignKey: "CourseId", as: "course" });

Section.hasMany(Lecture, { foreignKey: "SectionId", as: "lectures" });
Lecture.belongsTo(Section, { foreignKey: "SectionId", as: "section" });
User.hasMany(UserLastWatched, { foreignKey: "UserId", as: "userlastwatcheds" });
UserLastWatched.belongsTo(User, { foreignKey: "UserId", as: "user" });
UserLastWatched.hasMany(Course, {
  foreignKey: "UserLastWatchedId",
  as: "courses",
});
Course.belongsTo(UserLastWatched, {
  foreignKey: "UserLastWatchedId",
  as: "userlastwatched",
});

UserLastWatched.hasMany(Lecture, {
  foreignKey: "UserLastWatchedId",
  as: "lectures",
});
Lecture.belongsTo(UserLastWatched, {
  foreignKey: "UserLastWatchedId",
  as: "userlastwatched",
});
Lecture.hasMany(LectureProgress, {
  foreignKey: "LectureId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(Lecture, { foreignKey: "LectureId", as: "lecture" });
User.hasMany(LectureProgress, {
  foreignKey: "UserId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(User, { foreignKey: "UserId", as: "user" });
Course.hasMany(LectureProgress, {
  foreignKey: "CourseId",
  as: "lectureprogresses",
});
LectureProgress.belongsTo(Course, { foreignKey: "CourseId", as: "course" });
export {
  User,
  Server,
  Course,
  Section,
  Lecture,
  CourseFolder,
  UserLastWatched,
  LectureProgress,
};
