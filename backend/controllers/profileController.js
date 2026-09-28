const User = require("../models/User");

const parseNumericValue = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const validateProfilePayload = (profile = {}) => {
  const errors = [];

  const ensureNonNegative = (field, label) => {
    const numericValue = parseNumericValue(profile[field]);
    if (numericValue === null) return;

    if (numericValue < 0) {
      errors.push(`${label} cannot be negative.`);
    }
  };

  if (profile.gender && !['Female', 'Male', 'Other'].includes(profile.gender)) {
    errors.push('Gender must be Female, Male, or Other.');
  }

  if (profile.dob) {
    const selectedDob = new Date(`${profile.dob}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDob.getTime())) {
      errors.push('Date of birth is invalid.');
    } else if (selectedDob > today) {
      errors.push('Date of birth cannot be in the future.');
    }
  }

  ensureNonNegative('age', 'Age');
  ensureNonNegative('height', 'Height');
  ensureNonNegative('weight', 'Weight');
  ensureNonNegative('cycleLength', 'Cycle length');
  ensureNonNegative('sleepDuration', 'Sleep duration');

  return errors;
};

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
      "gender",
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

    const validationErrors = validateProfilePayload(profile);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
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
