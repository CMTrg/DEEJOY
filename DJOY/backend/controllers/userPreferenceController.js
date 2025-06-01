import UserPreference from "../models/userPreferenceModel.js";

export const getUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ user: req.user.userId });
    if (!preferences) return res.status(404).json({ message: "Preferences not found" });

    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setUserPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    let userPreferences = await UserPreference.findOne({ user: req.user.userId });

    if (userPreferences) {
      userPreferences.preferences = preferences;
    } else {
      userPreferences = new UserPreference({
        user: req.user.userId,
        preferences
      });
    }

    await userPreferences.save();
    res.status(200).json({ message: "Preferences updated", userPreferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserPreferences = async (req, res) => {
  try {
    await UserPreference.findOneAndDelete({ user: req.user.userId });
    res.status(200).json({ message: "Preferences deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
