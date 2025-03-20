import { CourseFolder, User } from "../models/index.js";
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAdminData = async (req, res) => {
  try {
    const [users, folders] = await Promise.all([
      User.findAll({
        attributes: ["id", "username", "role"],
      }),
      CourseFolder.findAll(),
    ]);

    res.status(200).json({ users, folders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
export { createUser, getAdminData };
