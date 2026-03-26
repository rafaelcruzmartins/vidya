import { CourseFolder, User } from "../models/index.js";
const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(200).send("user created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
const updateUser = async (req, res) => {
  const userId = req.body.id;
  const { username, password } = req.body;
  const updateData = {};

  if (username !== undefined) {
    updateData.username = username;
  }

  if (password !== undefined) {
    updateData.password = password;
  }
  try {
    const user = await User.findByPk(userId);
    await user.update(updateData);
    res.status(200).send("Successfully updated the user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
const promoteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    await user.update({ role: "admin" });
    res.status(200).send("successfully promoted user to admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
const removeUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    await user.destroy();
    res.status(200).send("successfully removed user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
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
export { createUser, getAdminData, updateUser, promoteUser, removeUser };
