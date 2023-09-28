import Course from "../models/course.model.js";
import Tag from "../models/category.model.js";
import User from "../models/user.model.js";
import { upload } from "../utils/imageUploader.js";

// fetching data, file, auth, tagValidation,courseEntry in user, addCourseEntry in tag
const createCourse = async (req, res) => {
	try {
		const userId = req.user.id;

		let { courseName, courseDescription, whatYouWillLearn, price, tag } =
			req.body;
		const thumbnail = req.files.thumbnailImage;

		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag.length ||
			!thumbnail ||
			!category ||
			!instructions.length
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}

		const instructorDetails = await User.findById(userId);

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const tagDetails = await Tags.findById(tag);
		if (!tagDetails) {
			return res.status(404).json({
				success: false,
				message: "Tag Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await upload(thumbnail, process.env.FOLDER_NAME);
		console.log(thumbnailImage);
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tagDetails._id,
			thumbnail: thumbnailImage.secure_url,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{ _id: instructorDetails._id },
			{ $push: { courses: newCourse._id } },
			{ new: true }
		);

		// tag schema updated
		const categoryDetails2 = await Category.findByIdAndUpdate(
			{ _id: category },
			{ $push: { courses: newCourse._id } },
			{ new: true }
		);

		console.log("updated tagDetails", categoryDetails2);
		// Return the new course and a success message
		res.status(201).json({
			success: true,
			message: "Course Created Successfully",
			data: newCourse,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

const getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find({
			courseName: true,
			price: true,
			thumbnail: true,
			instructor: true,
			ratingAndReviews: true,
			studentsEnrolled: true,
		})
			.populate("instructor")
			.exec();

		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

export { createCourse, getAllCourses };
