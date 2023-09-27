import { Schema, model } from "mongoose";

const courseProgress = new Schema({
  courseID: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  // rem this will be used to get percentages
  // and its subsection not section aon
  completedVideos: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export default model("CourseProgress", courseProgress);
