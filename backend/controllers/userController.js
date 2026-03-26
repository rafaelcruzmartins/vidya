import { TagsAndBookmark } from "../models/index.js";

const removeTag = async (req, res) => {
  const { id } = req.body;
  try {
    const tags = await TagsAndBookmark.findByPk(id);
    await tags.destroy();
    res.status(200).send("successfully deleted tag or bookmark");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export { removeTag };
