import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import axiosInstance from "../../services/axiosConfig";

interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Feedback {
  _id: string;
  user: User;
  course: Course;
  name: string;
  email: string;
  phone?: string;
  description: string;
  attachment?: string;
  createdAt: string;
}

export default function CourseFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/course-feedback/admin/all");
      if (res.data?.success) {
        setFeedbacks(res.data.data.feedbacks || []);
      } else {
        setError(res.data?.message || "Failed to fetch feedbacks");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <>
      <PageMeta
        title="Course Feedbacks"
        description="View all student feedbacks for courses"
      />
      <PageBreadcrumb pageTitle="Course Feedbacks" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          All Course Feedbacks
        </h3>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No feedbacks found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Course</th>
                  <th scope="col" className="px-6 py-3">Feedback Details</th>
                  <th scope="col" className="px-6 py-3">Attachment</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr
                    key={fb._id}
                    className="border-b bg-white dark:border-gray-800 dark:bg-transparent"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {fb.name}
                      </div>
                      <div className="text-xs">{fb.email}</div>
                      {fb.phone && <div className="text-xs">{fb.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {fb.course?.title || "Unknown Course"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs whitespace-pre-wrap">{fb.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      {fb.attachment ? (
                        <a
                          href={fb.attachment.startsWith('http') ? fb.attachment : `http://localhost:5000/${fb.attachment}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-500 hover:underline"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
