import TimeTrackingModal from "../Models/TimeCounter.model.js";
import RegisterModel from "../Models/Register.model.js";

// Register by admin Controller
export const TimeTrackingofUser = async (req, res) => {
  try {
    
    let {
      name,
      email,
      date,
      WorkTime,
      BreakTime,
      idleMsg,
      totalIdleTime,
      loginAt,
    } = req.body;

    // Ensure required fields are present
    if (!email || !date || WorkTime === undefined) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields.",
      });
    }

    // Set default values if undefined or empty
    WorkTime = WorkTime ?? 0;
    BreakTime = BreakTime ?? 0;
    totalIdleTime = totalIdleTime ?? 0;
    idleMsg = Array.isArray(idleMsg) ? idleMsg : [];
    loginAt = Array.isArray(loginAt) ? loginAt : [];

    const existingUser = await RegisterModel.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "failure", message: "User does not exist." });
    }

    // Check if entry for the same email and date exists
    const existingEntry = await TimeTrackingModal.findOne({ email, date });

    if (existingEntry) {
      // Avoid unnecessary updates if data is the same
      if (
        existingEntry.WorkTime === WorkTime &&
        existingEntry.BreakTime === BreakTime &&
        JSON.stringify(existingEntry.idleMsg) === JSON.stringify(idleMsg) &&
        existingEntry.totalIdleTime === totalIdleTime &&
        JSON.stringify(existingEntry.loginAt) === JSON.stringify(loginAt)
      ) {
        return res.status(200).json({
          status: "success",
          message: "No changes detected. Work time is already updated.",
          data: existingEntry,
        });
      }

      // Update the existing entry only if values change
      const updatedEntry = await TimeTrackingModal.findOneAndUpdate(
        { email, date },
        {
          $set: { name },
          $inc: { WorkTime, BreakTime, totalIdleTime }, // Increment values
          $push: { idleMsg: { $each: idleMsg }, loginAt: { $each: loginAt } }, // Append to arrays
        },
        { new: true } // Return updated document
      );

      return res.status(200).json({
        status: "success",
        message: "Work time updated successfully.",
        data: updatedEntry,
      });
    } else {
      // Create a new entry if not found
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

      return res.status(201).json({
        status: "success",
        message: "Your Work Time Saved Successfully.",
        data: newUser,
      });
    }
  } catch (err) {
    console.error("Error Saving Work Time:", err); // Debugging
    return res.status(500).json({
      status: "failure",
      message: "Your Work Time not Save. Error: " + err.message,
    });
  }
};
