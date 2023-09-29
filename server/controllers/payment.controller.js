import mongoose from "mongoose";
import Course from "../models/Course";
import User from "../models/user.model.js";
import mailSender from("../utils/mailSender.js");
// const crypto = require("crypto");
import instance from "../config/razorpay.js";

import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js"

//////// Capture payment & initiate order /////////
const capturePayment = async (req, res) => {

    // all carts is also handled
	const { courses } = req.body;
	const userId = req.user.id;
    
	if (courses.length === 0) {
		return res.json({ success: false, message: "Please Provide Course ID" });
	}

	let total_amount = 0;

    // go to each course calc totalPrice
	for (const course_id of courses) {
		let course;
		try {
			course = await Course.findById(course_id);

			if (!course) {
				return res
					.status(200)
					.json({ success: false, message: "Could not find the Course" });
			}

            // we have id in string form added in token but in db its objectID
			const uid = new mongoose.Types.ObjectId(userId);    
			// Check if the user is already enrolled in the course
			if (course.studentsEnroled.includes(uid)) {
				return res
					.status(200)
					.json({ success: false, message: "Student is already Enrolled, If you have extra money feed some poors" });
			}

			total_amount += course.price;
			// Add the price of the course to the total amount

		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	const options = {
		amount: total_amount * 100,
		currency: "INR",
		receipt: Math.random(Date.now()).toString(),
	};

    // Initiating the payment using Razorpay
	try {
		const paymentResponse = await instance.orders.create(options);
		console.log(paymentResponse);

		res.json({
			success: true,
			data: paymentResponse,
		});
        
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "Could not initiate order." });
	}
};

///////// verify payment using webhook //////////

const verifyPayment = async (req, res) => {

	const razorpay_signature = req.headers["x-razorpay-signature"]

    const courses = req.body?.courses
    const userId = req.user.id

	const expectedSignature = crypto
		.createHmac("sha256", process.env.RAZORPAY_SECRET)
		.update(JSON.stringify(req.body))
		.digest("hex");

	if (expectedSignature === razorpay_signature) {
        // update all courses and students
		await enrollStudents(courses, userId, res);

		return res.status(200).json({ success: true, message: "Payment Verified" });
	}

	return res.status(200).json({ success: false, message: "Payment Failed" });
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async (req, res) => {

	const { orderId, paymentId, amount } = req.body;
	const userId = req.user.id;

	if (!orderId || !paymentId || !amount || !userId) {
		return res
			.status(400)
			.json({ success: false, message: "Please provide all the details" });
	}

	try {
		const enrolledStudent = await User.findById(userId);


        // TODO: add different enrollment template
		await mailSender(
			enrolledStudent.email,
			`Payment Received`,
			"Thank you for purchasing course."
		);
	} catch (error) {
		console.log("error in sending mail", error);
		return res
			.status(400)
			.json({ success: false, message: "Could not send email" });
	}
};

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
	if (!courses || !userId) {
		return res.status(400).json({
			success: false,
			message: "Please Provide Course ID and User ID",
		});
	}

	for (const courseId of courses) {
		try {
			// Find the course and enroll the student in it
			const enrolledCourse = await Course.findOneAndUpdate(
				{ _id: courseId },
				{ $push: { studentsEnroled: userId } },
				{ new: true }
			);

			if (!enrolledCourse) {
				return res
					.status(500)
					.json({ success: false, error: "Course not found" });
			}
			console.log("Updated course: ", enrolledCourse);

			// Find the student and add the course to their list of enrolled courses
			const enrolledStudent = await User.findByIdAndUpdate(
				userId,
				{
					$push: {
						courses: courseId,
						courseProgress: courseProgress._id,
					},
				},
				{ new: true }
			);

			console.log("Enrolled student: ", enrolledStudent);

			// Send an email notification to the enrolled student
			const emailResponse = await mailSender(
				enrolledStudent.email,
				`Successfully Enrolled into ${enrolledCourse.courseName}`,
				courseEnrollmentEmail(
					enrolledCourse.courseName,
					`${enrolledStudent.firstName} ${enrolledStudent.lastName}`
				)
			);

			console.log("Email sent successfully: ", emailResponse.response);
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error: error.message });
		}
	}
};


export {capturePayment, verifyPayment, sendPaymentSuccessEmail, enrollStudents};