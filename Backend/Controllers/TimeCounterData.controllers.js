import TimeTrackingModal from "../Models/TimeCounter.model.js";
import RegisterModel from "../Models/Register.model.js";

// Register by admin Controller
export const TimeTrackingofUser = async (req, res) => {
  try {
    const {
      name,
      email,
      date,
      WorkTime,
      BreakTime,
      idleMsg,
      totalIdleTime,
      loginAt,
    } = req.body;

    const existingUser = await RegisterModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(500)
        .json({ status: "failure", message: "User not exists." });
    }

    if (email == existingUser.email) {
      const newUser = new TimeTrackingModal({
        name,
        email,
        date,
        WorkTime,
        BreakTime,
        idleMsg,
        totalIdleTime,
        loginAt,
      });

      await newUser.save();
      res.status(201).json({
        Status: "success",
        message: "Your Work Time Saved Successfully.",
        data: newUser,
      });
    } else {
      res
        .status(400)
        .json({ status: "failure", message: "your email not exists" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ status: "failed", message: "Your Work Time not Save." });
  }
};
