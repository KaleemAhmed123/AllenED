// forgetPasswordToken

// forgetPassword

// will generate a link and send to mail then on that user will enter new password .
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
// diff token ke base pe diff links will be generated for dif user
const resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `This email is not registered.`,
      });
    }

    // generate token then update user by adding token and expiration time
    const token = crypto.randomUUID();

    const tokenAddedUser = User.findOneAndUpdate(
      { email },
      { token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    console.log("DETAILS", tokenAddedUser);

    //  create url, send email then return response
    const resetUrl = `http://localhost:3000/update-password/${token}`;

    mailSender(email, `Password reset link`, `Password reset link ${resetUrl}`);

    return res.status(200).json({
      success: true,
      message: `A password reset link has been sent to your email address.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: `Something went wrong resetting password`,
    });
  }
};

// fetch data, validate, get USER from db using token, hash and update return;
const resetPassword = async (req, res) => {
  try {
    // token will be added in body by frontend
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: `Password not matching`,
      });
    }

    // user on the basis of link's token (by frontend)
    const user = User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Token not valid.`,
      });
    }
    // check not expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: `Token is expired, plz regenerate your token.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Password updated successfully mauj karo`,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: `Something went wrong resetting password`,
    });
  }
};

export { resetPasswordToken, resetPassword };
//
