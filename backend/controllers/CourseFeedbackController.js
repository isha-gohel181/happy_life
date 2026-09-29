import CourseFeedback from "../models/CourseFeedback.js";
import { initRedis } from "../config/redisClient.js";

export const submitFeedback = async (req, res) => {
  try {
    const { courseId, name, email, phone, description } = req.body;
    const userId = req.user._id;

    if (!courseId || !name || !email || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let attachment = req.file?.path?.replace(/\\/g, "/");

    // Check if feedback already exists for this user and course
    let feedback = await CourseFeedback.findOne({ user: userId, course: courseId });

    if (feedback) {
      // Update existing
      feedback.name = name;
      feedback.email = email;
      feedback.phone = phone || feedback.phone;
      feedback.description = description;
      if (attachment) {
        feedback.attachment = attachment;
      }
      await feedback.save();
    } else {
      // Create new
      feedback = new CourseFeedback({
        user: userId,
        course: courseId,
        name,
        email,
        phone,
        description,
        attachment
      });
      await feedback.save();
    }

    const redis = await initRedis();
    await redis.del(`feedbacks:all`);
    await redis.del(`feedback:${userId}:${courseId}`);

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const cacheKey = `feedback:${userId}:${courseId}`;
    const redis = await initRedis();
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        message: "Feedback fetched from cache",
        data: JSON.parse(cached),
        fromCache: true
      });
    }

    const feedback = await CourseFeedback.findOne({ user: userId, course: courseId }).populate('course', 'title');
    
    if (feedback) {
      await redis.setEx(cacheKey, 300, JSON.stringify(feedback));
    }

    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      data: feedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `feedbacks:all:page:${page}:limit:${limit}`;
    const redis = await initRedis();
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        message: "All feedbacks fetched from cache",
        data: JSON.parse(cached),
        fromCache: true
      });
    }

    const feedbacks = await CourseFeedback.find()
      .populate('course', 'title thumbnail')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CourseFeedback.countDocuments();

    const responseData = {
      feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    await redis.setEx(cacheKey, 300, JSON.stringify(responseData));

    res.status(200).json({
      success: true,
      message: "All feedbacks fetched successfully",
      data: responseData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
