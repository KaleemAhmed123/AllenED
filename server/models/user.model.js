// Import the Mongoose library
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // later profile thing in "Profile" model
    additionalDetails: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
    image: {
      type: String,
    },
    // with help of token we'll get the user data in /reset-pass link
    // because there we wont be anything to access user data
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
