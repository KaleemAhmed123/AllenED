import Section from "../models/section.model.js";
import SubSection from "../models/subSection.model.js";
import upload from "../utils/imageUploader.js";

//////////  CREATE NEW SECTION  ///////////
export async function createSubSection(req, res) {
	try {
		const { sectionId, title, description } = req.body;
		const video = req.files.video;

		if (!sectionId || !title || !description || !video) {
			return res
				.status(404)
				.json({ success: false, message: "All Fields are Required" });
		}

		const uploadDetails = await upload(video, process.env.FOLDER_NAME);

		const SubSectionDetails = await SubSection.create({
			title: title,
			timeDuration: `${uploadDetails.duration}`,
			description: description,
			videoUrl: uploadDetails.secure_url,
		});

		// updating corresponding section
		const updatedSection = await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{ $push: { subSection: SubSectionDetails._id } },
			{ new: true }
		).populate("subSection");

		return res.status(200).json({ success: true, data: updatedSection });
	} catch (error) {
		console.error("Error while creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

//////////  UPDATE SECTION  ///////////
export async function updateSubSection(req, res) {
	try {
		const { sectionId, subSectionId, title, description } = req.body;
		const subSection = await SubSection.findById(subSectionId);

		if (!subSection) {
			return res.status(404).json({
				success: false,
				message: "SubSection not found",
			});
		}

		if (title !== undefined) subSection.title = title;
		if (description !== undefined) subSection.description = description;

		if (req.files && req.files.video !== undefined) {
			const video = req.files.video;
			const uploadDetails = await uploadImageToCloudinary(
				video,
				process.env.FOLDER_NAME
			);
			subSection.videoUrl = uploadDetails.secure_url;
			subSection.timeDuration = `${uploadDetails.duration}`;
		}

		await subSection.save(); // manually (practice all ways)

		const updatedSection = await findById(sectionId).populate("subSection");

		console.log("updated section", updatedSection);

		return res.json({
			success: true,
			message: "Section updated successfully",
			data: updatedSection,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "error while updating section",
		});
	}
}

export async function deleteSubSection(req, res) {
	try {
		const { subSectionId, sectionId } = req.body;

		// updating corresponding section
		await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{ $pull: { subSection: subSectionId } }
		);
		const subSection = await findByIdAndDelete({ subSectionId });

		if (!subSection) {
			return res
				.status(404)
				.json({ success: false, message: "SubSection not found" });
		}

		const updatedSection = await findById(sectionId).populate("subSection");

		return res.json({
			success: true,
			message: "SubSection deleted successfully",
			data: updatedSection,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "An error occurred while deleting the SubSection",
		});
	}
}
