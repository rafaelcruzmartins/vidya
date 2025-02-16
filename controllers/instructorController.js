import { Instructor } from "../models/index.js";

const instructor = async (req, res) => {
  const { name } = req.body;
  try {
    await Instructor.create({ name });
    const instructors = await Instructor.findAll();
    res.json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export { instructor };
