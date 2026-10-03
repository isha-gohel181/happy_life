import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";
import FileInput from "../../components/form/input/FileInput";
import Quiz from "../../pages/courses/components/Quiz";

export default function AddEditTestSeries() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    totalMarks: 100,
    timeLimit: 60,
    level: "medium",
    passMark: 40,
    isActive: true,
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTestSeries();
    }
  }, [id]);

  const fetchTestSeries = async () => {
    try {
      const { data } = await axiosInstance.get(`/test-series/${id}`);
      if (data.success) {
        const ts = data.testSeries;
        setFormData({
          title: ts.title,
          description: ts.description,
          price: ts.price,
          totalMarks: ts.totalMarks,
          timeLimit: ts.timeLimit,
          level: ts.level,
          passMark: ts.passMark,
          isActive: ts.isActive,
        });
        if (ts.coverImage) {
          const imgBase = (import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || 'https://happy-life-sx03.onrender.com').replace(/\/+$/, '');
          setCoverImagePreview(ts.coverImage.startsWith('http') ? ts.coverImage : `${imgBase}${ts.coverImage.startsWith('/') ? '' : '/'}${ts.coverImage}`);
        }
        // If it has sections, wrap it in a mock object that matches what Quiz component expects
        if (ts.sections && ts.sections.length > 0) {
          setQuizData({ sections: ts.sections });
        }
      }
    } catch (error) {
      console.error("Error fetching test series", error);
      toast.error("Failed to fetch Test Series details");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImageFile(e.target.files[0]);
      setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });

      if (coverImageFile) {
        submitData.append("coverImage", coverImageFile);
      }
      
      if (quizData) {
        submitData.append("quizData", JSON.stringify(quizData));
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEdit) {
        await axiosInstance.put(`/test-series/${id}`, submitData, config);
        toast.success("Test Series updated successfully!");
      } else {
        await axiosInstance.post("/test-series", submitData, config);
        toast.success("Test Series created successfully!");
      }
      navigate("/test-series");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save Test Series");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title={`${isEdit ? 'Edit' : 'Add'} Test Series | Happy Life`} description="Manage Test Series" />
      <PageBreadcrumb pageTitle={`${isEdit ? 'Edit' : 'Add'} Test Series`} />
      
      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Test Series Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" rows={4} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (INR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Limit (mins)</label>
              <input type="number" name="timeLimit" value={formData.timeLimit} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pass Mark (%)</label>
              <input type="number" name="passMark" value={formData.passMark} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image / Thumbnail</label>
            <FileInput onChange={handleCoverImageChange} accept="image/*" />
            {coverImagePreview && (
              <div className="mt-4">
                <img src={coverImagePreview} alt="Cover Preview" className="h-32 rounded-lg object-cover" />
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Questions & Sections</h4>
                <p className="text-sm text-gray-500">
                  {quizData ? `Configured with ${quizData.sections?.length || 0} sections` : "No quiz sections configured yet"}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowQuizModal(true)}
                className="px-4 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-100"
              >
                {quizData ? "Manage Questions" : "Add Questions"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active (Visible to users)</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => navigate("/test-series")} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showQuizModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#182131] rounded-xl shadow-2xl relative">
            <Quiz
              onClose={() => setShowQuizModal(false)}
              initialQuizData={quizData}
              onSubmitQuizData={(data) => {
                setQuizData(data);
                setShowQuizModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
