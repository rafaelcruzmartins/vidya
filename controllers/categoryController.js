import { Category, Course } from "../models/index.js";
const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await Category.create({ category: name });
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

const allCategory = async (req, res) => {
  try {
    const { limit } = req.query;

    const options = {};

    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    const categories = await Category.findAll(options);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send("Unable to find catgories");
    console.error(error);
  }
};

const courseOfCategories = async (req, res) => {
  const { CategoryId } = req.body;
  try {
    const courseOfCategory = await Category.findByPk(CategoryId, {
      include: {
        model: Course,
        as: "courses",
        attributes: ["id", "cleanedName", "photo"],
      },
    });
    res.status(200).json(courseOfCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
export { createCategory, allCategory, courseOfCategories };
