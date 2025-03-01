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
    const instructors = await Instructor.findAll();
    res.status(200).json(instructors);
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
        attributes: ["id", "photo", "cleanedName"],
      },
      attributes: ["name", "description", "id", "photo"],
    });
    const plainInstructor = instructor.toJSON();
    res.status(200).json({ ...plainInstructor, role });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
export { createInstructor, getAllInstructor, individualInstructor };
