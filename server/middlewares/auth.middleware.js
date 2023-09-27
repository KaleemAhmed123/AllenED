// validToken, isStudent, isInstructor, isAdmin

import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { findOne } from "../models/User";
config();

// validToken
// This function is used as middleware to authenticate user requests
export async function auth(req, res, next) {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // JWT is missing, return 401 Unauthorized request
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    try {
      const decode = verify(token, process.env.JWT_SECRET);
      console.log(decode);
      //  adding email,_id, role for further use
      req.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
}

// isStudent
export async function isStudent(req, res, next) {
  try {
    const userDetails = await findOne({ email: req.user.email });

    if (userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Students",
      });
    }
    // if its Student move for routes
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
}

// isInstructor
export async function isInstructor(req, res, next) {
  try {
    const userDetails = await findOne({ email: req.user.email });
    console.log(userDetails);
    console.log(userDetails.accountType);

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
}

// isAdmin
export async function isAdmin(req, res, next) {
  try {
    const userDetails = await findOne({ email: req.user.email });

    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
}
