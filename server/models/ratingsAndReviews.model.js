import { Schema, model } from "mongoose";

const ratingAndReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
});

export default model("RatingAndReview", ratingAndReviewSchema);
