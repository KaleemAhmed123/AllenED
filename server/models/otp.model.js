import { Schema, model } from "mongoose";
import mailSender from "../utils/mailSender.js";
// import emailTemplate from "../mail/templates/emailVerificationTemplate";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // document will be deleted automatically after 5 minutes
  },
});

// Create a transporter, email options, Send email using mailSender
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = mailSender(
      email,
      "Verification Email from myDemy",
      otp
      // emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error while sending email: ", error);
    throw error;
  }
}
// rule schema ke neeche model ke upar
// Define a pre-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) await sendVerificationEmail(this.email, this.otp);

  next();
});

const OTP = model("OTP", OTPSchema);

export default OTP;
