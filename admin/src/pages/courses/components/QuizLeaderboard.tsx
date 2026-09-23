import React, { useState, useEffect } from "react";
import { X, Trophy, Clock, Medal, Award, User, Loader2 } from "lucide-react";
import axiosInstance from "../../../services/axiosConfig";

interface QuizLeaderboardProps {
  courseId: string;
  quizId: string;
  onClose: () => void;
  isOpen: boolean;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  submittedAt: string;
}

const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({
  courseId,
  quizId,
  onClose,
  isOpen,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && courseId && quizId) {
      fetchLeaderboard();
    }
  }, [isOpen, courseId, quizId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(
        `/quiz/leaderboard/${courseId}/${quizId}`
      );
      if (response.data.success) {
        setLeaderboard(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch leaderboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while fetching data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-700 border-gray-200";
      case 3:
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="font-bold text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quiz Leaderboard</h2>
              <p className="text-blue-100 text-sm">
                Top performers for this quiz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">
                Loading leaderboard...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-red-50 rounded-xl border border-red-100">
              <div className="p-3 bg-red-100 rounded-full">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-4 bg-slate-50 rounded-full">
                <Trophy className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-lg">
                No submissions yet
              </p>
              <p className="text-slate-400 text-sm">
                Students haven't completed this quiz yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${getRankStyle(
                    entry.rank
                  )}`}
                >
                  {/* Rank & User Info */}
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="flex items-center justify-center w-10 h-10 shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {entry.profilePic ? (
                        <img
                          src={entry.profilePic}
                          alt={entry.firstName}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-800">
                          {entry.firstName} {entry.lastName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {new Date(entry.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 self-end sm:self-auto w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Score
                      </p>
                      <p className="font-bold text-slate-800">
                        {entry.score} / {entry.totalMarks}
                      </p>
                    </div>
                    
                    <div className="w-px h-8 bg-slate-200"></div>
                    
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Percentage
                      </p>
                      <p
                        className={`font-bold ${
                          entry.percentage >= 70
                            ? "text-emerald-600"
                            : entry.percentage >= 40
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}
                      >
                        {entry.percentage.toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="w-px h-8 bg-slate-200"></div>
                    
                    <div className="text-right flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">
                          Time
                        </p>
                        <p className="font-bold text-slate-700 text-sm">
                          {formatTime(entry.timeTaken)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizLeaderboard;
