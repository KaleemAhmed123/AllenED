import mongoose from "mongoose";
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedToplogy: true,
    })
    .then(() => console.log("DB conneted"))
    .catch((err) => {
      console.log("DB connection failed");
      console.error(err);
      process.exit(1);
    });
};
