import UserService from "../service/userService.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import Leaderboard from "../models/Leaderboard.js";

const userService = new UserService();

export const getStudentWebProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await userService.getUserById(id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        data: {},
        err: {}
      });
    }

    const enrollments = await CourseEnrollment.find({ userId: student._id, status: 'active' })
      .populate('courseId', 'title level')
      .lean();

    const leaderboard = await Leaderboard.findOne({ userId: student._id }).lean();

    const safeData = {
      name: student.fullName,
      bio: student.bio || null,
      profilePicture: student.profilePicture || null,
      education: student.education || [],
      skills: student.skills || [],
      enrollCourse: enrollments
        .filter(e => e.courseId)
        .map(e => ({
          title: e.courseId.title,
          level: Array.isArray(e.courseId.level) ? e.courseId.level : [e.courseId.level],
          xp: leaderboard?.xp || 0
        })),
      level: leaderboard?.level || null,
      xp: leaderboard?.xp || 0,
      lastUpdatedAt: student.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Student profile fetched successfully',
      data: safeData,
      err: {}
    });
  } catch (error) {
    console.error("Error in getStudentWebProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
      data: {},
      err: error.message
    });
  }
};
