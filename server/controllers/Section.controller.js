import Section from "../models/section.model.js";
import Course from "../models/course.model.js";

const createSection = async (req, res) => {
	try {
		const { sectionName, courseId } = req.body;
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: `Required properties missing`,
			});
		}

		const newSection = await Section.create({ sectionName });

		// Adding the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{ $push: { courseContent: newSection._id } },
			{ new: true }
		)
			.populate({
				path: "courseContent", // That array where we are storing Section
				populate: {
					path: "SubSection",
				},
			})
			.exec();

		return res.status(201).json({
			success: true,
			message: `Section created successfully`,
			data: updatedCourse,
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: `Error while creating section`,
		});
	}
};

const updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId, courseId } = req.body;
		const updatedSection = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent", // same TODO maybe
				populate: { path: "SubSection" },
			})
			.exec();

		console.log(course);
		res.status(200).json({
			success: true,
			message: updatedSection,
			data: course,
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: `Error while editing section`,
		});
	}
};

const deleteSection = async (req, res) => {
	try {
		const { sectionId, courseId } = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: { courseContent: sectionId },
		});

		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if (!section || !courseId) {
			return res.status(404).json({
				success: false,
				message: "properties not found",
			});
		}

		await Section.findByIdAndDelete(sectionId);

		// find the updated course and return it
		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: { path: "SubSection" },
			})
			.exec();

		res.status(200).json({
			success: true,
			message: "Section deleted",
			data: course,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "error while deleting section",
			error: error.message,
		});
	}
};

export { createSection, updateSection, deleteSection };

// may have many issues will sort out in testing
