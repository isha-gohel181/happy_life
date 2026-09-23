import Setting from '../models/setting.js';

export const getSettings = async (req, res) => {
  try {
    // Validate Content-Type
    if (!req.is('application/json')) {
      return res.status(400).json({ message: "Content-Type must be application/json" });
    }

    const { keys } = req.body;

    // Validate input
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ message: "Keys must be a non-empty array" });
    }

    //console.log("Requested keys:", keys); // Debug log

    // Fetch settings for the provided keys
    const settings = await Setting.find({ key: { $in: keys } }).select('key value description');

    // Create a response object mapping keys to values
    const result = {};
    keys.forEach(key => {
      const setting = settings.find(s => s.key === key);
      result[key] = setting ? setting.value : null; // Return null if key not found
    });

    return res.status(200).json({
      message: "Settings retrieved successfully",
      settings: result
    });
  } catch (err) {
    console.error("Get Settings Error:", err);
    return res.status(500).json({ message: "Failed to retrieve settings", error: err.message });
  }
};


export const getAllSettings = async (req, res) => {
  try {
    // Fetch all settings
    const settings = await Setting.find().select('key value description');

    // Create a response object mapping keys to values
    const result = {};
    settings.forEach(setting => {
      result[setting.key] = setting.value;
    });

    return res.status(200).json({
      message: "All settings retrieved successfully",
      settings: result
    });
  } catch (err) {
    console.error("Get All Settings Error:", err);
    return res.status(500).json({ message: "Failed to retrieve all settings", error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    // Validate Content-Type
    if (!req.is('application/json')) {
      return res.status(400).json({ message: "Content-Type must be application/json" });
    }

    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: "Request body must be a JSON object" });
    }

    const updatedSettings = {};
    for (const [key, value] of Object.entries(updates)) {
      const setting = await Setting.findOneAndUpdate(
        { key },
        { value },
        { new: true, upsert: true }
      );
      updatedSettings[setting.key] = setting.value;
    }

    return res.status(200).json({
      message: "Settings updated successfully",
      settings: updatedSettings
    });
  } catch (err) {
    console.error("Update Settings Error:", err);
    return res.status(500).json({ message: "Failed to update settings", error: err.message });
  }
};