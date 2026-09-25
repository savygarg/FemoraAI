const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user.profile || {},
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

const saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = req.body || {};

    const requiredFields = [
      "age",
      "height",
      "weight",
      "bloodGroup",
      "periodRegularity",
      "cycleLength",
      "menstrualFlow",
    ];
    const hasMissingRequiredField = requiredFields.some((field) => !profile[field]);

    if (hasMissingRequiredField) {
      return res.status(400).json({
        success: false,
        message: "Age, height, weight, blood group, cycle regularity, cycle length, and menstrual flow are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updated = await User.updateProfile(userId, profile);

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile: updated.profile || profile,
    });
  } catch (error) {
    console.error("Save profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
};

module.exports = {
  getProfile,
  saveProfile,
};
