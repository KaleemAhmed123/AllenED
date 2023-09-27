import { Schema, model } from "mongoose";

const SubSectionSchema = new Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

export default model("SubSection", SubSectionSchema);
