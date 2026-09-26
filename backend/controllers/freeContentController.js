import FreeContentService from '../service/FreeContentService.js';
import FreeQuiz from '../models/FreeQuiz.js';
import FreeQuizAttempt from '../models/FreeQuizAttempt.js';
import FreeQuizSubmission from '../models/FreeQuizSubmission.js';

const freeContentService = new FreeContentService();

export const createFreeContent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        let normalizedPath = req.files.thumbnail[0].path.replace(/\\/g, "/");
        const upIndex = normalizedPath.indexOf("uploads/");
        if (upIndex !== -1) normalizedPath = normalizedPath.substring(upIndex);
        data.thumbnail = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
      }
      if (req.files.pdfFile && req.files.pdfFile[0]) {
        let normalizedPath = req.files.pdfFile[0].path.replace(/\\/g, "/");
        const upIndex = normalizedPath.indexOf("uploads/");
        if (upIndex !== -1) normalizedPath = normalizedPath.substring(upIndex);
        data.fileUrl = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
      }
    }
    
    // If it's a test and we have quiz data, create the quiz first
    if (data.contentType === 'test' && data.quizData) {
      if (typeof data.quizData === 'string') {
        data.quizData = JSON.parse(data.quizData);
      }
      const quiz = new FreeQuiz(data.quizData);
      const savedQuiz = await quiz.save();
      data.freeQuiz = savedQuiz._id;
    }

    const content = await freeContentService.createContent(data);
    res.status(201).json({ success: true, message: 'Free Content created', data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllFreeContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      contentType,
      isActive
    } = req.query;

    const filters = {};
    if (contentType) filters.contentType = contentType;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      sortBy,
      sortOrder,
      filters
    };

    const result = await freeContentService.getAllContent(options);
    res.status(200).json({ success: true, message: 'Free Content fetched', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFreeContentById = async (req, res) => {
  try {
    const content = await freeContentService.getContentById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.status(200).json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFreeContent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        let normalizedPath = req.files.thumbnail[0].path.replace(/\\/g, "/");
        const upIndex = normalizedPath.indexOf("uploads/");
        if (upIndex !== -1) normalizedPath = normalizedPath.substring(upIndex);
        data.thumbnail = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
      }
      if (req.files.pdfFile && req.files.pdfFile[0]) {
        let normalizedPath = req.files.pdfFile[0].path.replace(/\\/g, "/");
        const upIndex = normalizedPath.indexOf("uploads/");
        if (upIndex !== -1) normalizedPath = normalizedPath.substring(upIndex);
        data.fileUrl = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
      }
    }
    
    // If updating a test and we have quiz data
    if (data.contentType === 'test' && data.quizData) {
      if (typeof data.quizData === 'string') {
        data.quizData = JSON.parse(data.quizData);
      }
      if (data.freeQuiz) {
        // update existing quiz
        await FreeQuiz.findByIdAndUpdate(data.freeQuiz, data.quizData);
      } else {
        // create new quiz
        const quiz = new FreeQuiz(data.quizData);
        const savedQuiz = await quiz.save();
        data.freeQuiz = savedQuiz._id;
      }
    }

    const updated = await freeContentService.updateContent(req.params.id, data);
    res.status(200).json({ success: true, message: 'Content updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFreeContent = async (req, res) => {
  try {
    const content = await freeContentService.getContentById(req.params.id);
    if (content && content.contentType === 'test' && content.freeQuiz) {
      await FreeQuiz.findByIdAndDelete(content.freeQuiz._id);
    }
    const deleted = await freeContentService.deleteContent(req.params.id);
    res.status(200).json({ success: true, message: 'Content deleted', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Quiz Specific methods for the App
export const startFreeQuiz = async (req, res) => {
  try {
    const { freeQuizId } = req.body;
    const userId = req.user._id;

    const quiz = await FreeQuiz.findById(freeQuizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check attempts limit
    if (quiz.maxAttempts > 0) {
      const attemptsCount = await FreeQuizAttempt.countDocuments({ user: userId, freeQuiz: freeQuizId });
      if (attemptsCount >= quiz.maxAttempts) {
        return res.status(403).json({ success: false, message: 'Maximum attempts reached' });
      }
    }

    const attempt = new FreeQuizAttempt({
      user: userId,
      freeQuiz: freeQuizId,
      status: 'in_progress'
    });
    await attempt.save();

    res.status(200).json({ success: true, message: 'Quiz started', data: attempt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitFreeQuiz = async (req, res) => {
  try {
    const { freeQuizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user._id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers are required and must be an array' });
    }

    const quiz = await FreeQuiz.findById(freeQuizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let score = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    // Calculate score (simple logic, assuming flat sections or simple array for now)
    // Actually need to iterate sections
    let allQuestions = [];
    if (quiz.sections && quiz.sections.length > 0) {
      quiz.sections.forEach(sec => {
        allQuestions = allQuestions.concat(sec.questions);
      });
    }

    answers.forEach(ans => {
      const questionDef = allQuestions.find(q => q.question === ans.question);
      if (questionDef) {
        if (questionDef.correctAnswer === ans.selectedOption) {
          score += questionDef.marks;
          totalCorrect += 1;
        } else {
          totalWrong += 1;
        }
      }
    });

    const percentage = (score / quiz.totalMarks) * 100;
    const passed = percentage >= quiz.passMark;

    const submission = new FreeQuizSubmission({
      user: userId,
      freeQuiz: freeQuizId,
      answers,
      score,
      totalMarks: quiz.totalMarks,
      passed,
      totalQuestions: allQuestions.length,
      totalCorrectQuestions: totalCorrect,
      totalWrongQuestions: totalWrong,
      percentage,
      timeTaken: timeTaken || 0,
      is_completed: true
    });
    await submission.save();

    // Mark attempt as completed
    await FreeQuizAttempt.findOneAndUpdate(
      { user: userId, freeQuiz: freeQuizId, status: 'in_progress' },
      { status: 'completed' }
    );

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: submission
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFreeQuizHistory = async (req, res) => {
  try {
    const { freeQuizId } = req.params;
    const userId = req.user._id;

    const submissions = await FreeQuizSubmission.find({ user: userId, freeQuiz: freeQuizId }).sort({ createdAt: -1 });
    const quiz = await FreeQuiz.findById(freeQuizId);

    res.status(200).json({ 
      success: true, 
      data: {
        submissions,
        maxAttempts: quiz ? quiz.maxAttempts : 0,
        attemptsCount: submissions.length
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
