import User from "./User.js";
import Server from "./Server.js";
import Course from "./Course.js";
import Section from "./Section.js";
import Lecture from "./Lecture.js";
import Progress from "./Progress.js";

Server.hasMany(Course, { foreignKey: "ServerId", as: "courses" });
Course.belongsTo(Server, { foreignKey: "ServerId", as: "server" });

Course.hasMany(Section, { foreignKey: "CourseId", as: "sections" });
Section.belongsTo(Course, { foreignKey: "CourseId", as: "course" });

Section.hasMany(Lecture, { foreignKey: "SectionId", as: "lectures" });
Lecture.belongsTo(Section, { foreignKey: "SectionId", as: "section" });

export { User, Server, Course, Section, Lecture, Progress };
