import Category from "../models/category.model.js";

/////////////  CREATE CATEGORIES  ////////////
const createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name || !description) {
			return res.status(400).json({
				success: false,
				message: `All fields are required`,
			});
		}

		const categoryDetails = await Category.create({ name, description });
		console.log(categoryDetails);

		return res.status(201).json({
			success: true,
			message: `Category created successfully`,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

/////////////  GET ALL CATEGORIES  ////////////
const getAllCategory = async (req, res) => {
	try {
		const allCategories = await Category.find();

		return res.status(200).json({
			success: false,
			message: `All Categories returned successfully`,
			data: allCategories,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export { createCategory, getAllCategory };
