import { Category } from "../models/index.js";
const category = async (req, res) => {
  const { name } = req.body;
  try {
    await Category.create({ category: name });
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
export { category };
