import Profile from "../models/profile.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/////////// UPDATE PROFILE  ////////////
const updateProfile = async (req, res) => {
	try {
		const {
			firstName = "",
			lastName = "",
			dateOfBirth = "",
			about = "",
			contactNumber = "",
			gender = "",
		} = req.body;
		const id = req.user.id;

		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		const user = await User.findByIdAndUpdate(id, {
			firstName,
			lastName,
		});

		await user.save();

		// Updating manually becz null add kiya tha
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
		profile.gender = gender;

		await profile.save();

		const updatedUserDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			updatedUserDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: `error while updating profile`,
			error: error.message,
		});
	}
};

/////////////  GET USER DETAILS  //////////////
const getUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();

		console.log(userDetails);

		res.status(200).json({
			success: true,
			message: "User Data fetched",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

/////////// DELETE ACCOUNT  ///////////////
// TODO: search how to schedule this deleteAccount "CRONE JOB"
const deleteAccount = async (req, res) => {
	try {
		const id = req.user.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// DBT
		await Profile.findByIdAndDelete({
			_id: new mongoose.Types.ObjectId(user.additionalDetails),
		});

		// unenroll from course becz we have to update count of totalEnrolled
		// see course schema
		for (const courseId of user.courses) {
			// remove this user from that course
			await Course.findByIdAndUpdate(
				courseId,
				{ $pull: { studentsEnrolled: id } },
				{ new: true }
			);
		}

		await User.findByIdAndDelete({ _id: id });

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export { updateProfile, getUserDetails, deleteAccount };
