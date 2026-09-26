import TestSeries from "../models/TestSeries.js";

// GET /api/test-series - Fetch all active test series for the app
export const getTestSeriesList = async (req, res) => {
  try {
    const testSeries = await TestSeries.find({ isActive: true })
      .select('title description price totalMarks timeLimit level passMark coverImage')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, testSeries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/test-series/:id - Fetch a specific test series by ID
export const getTestSeriesById = async (req, res) => {
  try {
    const testSeries = await TestSeries.findById(req.params.id);
    if (!testSeries) {
      return res.status(404).json({ success: false, message: 'Test Series not found' });
    }
    res.status(200).json({ success: true, testSeries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/test-series - Create a new test series (Admin only)
export const createTestSeries = async (req, res) => {
  try {
    const testSeries = new TestSeries(req.body);
    await testSeries.save();
    res.status(201).json({ success: true, testSeries });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/test-series/:id - Update a test series (Admin only)
export const updateTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeries.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testSeries) {
      return res.status(404).json({ success: false, message: 'Test Series not found' });
    }
    res.status(200).json({ success: true, testSeries });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/test-series/:id - Delete a test series (Admin only)
export const deleteTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeries.findByIdAndDelete(req.params.id);
    if (!testSeries) {
      return res.status(404).json({ success: false, message: 'Test Series not found' });
    }
    res.status(200).json({ success: true, message: 'Test Series deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
