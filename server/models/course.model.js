import { Schema, model } from "mongoose";

const coursesSchema = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
  },
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // a user
  },
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  // those section and section will have subSection
  courseContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  // those ui tags
  category: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  // babb has single enroled
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Course", coursesSchema);
