import { Course, Instructor } from "../models/index.js";

const createInstructor = async (req, res) => {
  const { name } = req.body;
  try {
    await Instructor.create({ name });
    const instructors = await Instructor.findAll();
    res.status(200).json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

const getAllInstructor = async (req, res) => {
  try {
    const instructors = await Instructor.findAll({
      include: [
        {
          model: Course,
          as: "courses",
          attributes: ["duration"],
        },
      ],
      raw: false,
    });

    const instructorsWithDuration = instructors.map((instructor) => {
      const instructorData = instructor.toJSON();

      const totalDuration = instructorData.courses.reduce((total, course) => {
        return total + (course.duration || 0);
      }, 0);

      instructorData.totalCourseDuration = totalDuration;

      return instructorData;
    });

    res.status(200).json(instructorsWithDuration);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const individualInstructor = async (req, res) => {
  const { InstructorId } = req.body;
  const role = req.user.role;
  try {
    const instructor = await Instructor.findByPk(InstructorId, {
      include: {
        model: Course,
        as: "courses",
        attributes: ["id", "photo", "cleanedName", "duration"],
      },
      attributes: ["name", "description", "id", "photo"],
    });
    const instructorData = instructor.toJSON();

    const totalDuration = instructorData.courses.reduce((total, course) => {
      return total + (course.duration || 0);
    }, 0);

    instructorData.totalCourseDuration = totalDuration;

    res.status(200).json({ ...instructorData, role });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
export { createInstructor, getAllInstructor, individualInstructor };
