import Tag from "../models/category.model.js";

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: `All fields are required`,
      });
    }

    const tagDetails = await createTag({ name, description });
    console.log(tagDetails);

    return res.status(201).json({
      success: true,
      message: `Tag created successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTags = async (req, res) => {
  try {
    const allTags = Tag.find({}, { name: true, description: true });

    return res.status(200).json({
      success: false,
      message: `All tags returned successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createTag, getAllTags };