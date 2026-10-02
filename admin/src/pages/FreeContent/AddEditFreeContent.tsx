import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../services/axiosConfig";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import Quiz from "../../pages/courses/components/Quiz";

export default function AddEditFreeContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "pdf",
    fileUrl: "",
    videoUrl: "",
    isDownloadable: false,
    isActive: true,
    thumbnail: "",
    freeQuiz: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      const { data } = await axiosInstance.get(`/free-content/${id}`);
      if (data.success) {
        setFormData(data.data);
        if (data.data.thumbnail) {
          setThumbnailPreview(`${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${data.data.thumbnail}`);
        }
        if (data.data.freeQuiz) {
          setQuizData(data.data.freeQuiz);
        }
      }
    } catch (error) {
      console.error("Error fetching content", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailFile(e.target.files[0]);
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Skip null or undefined or empty string for object ids
        if (value !== null && value !== undefined && key !== 'thumbnail' && key !== 'pdfFile') {
          if (key === 'freeQuiz' && value === "") return;
          submitData.append(key, String(value));
        }
      });
      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }
      if (pdfFile && formData.contentType === "pdf") {
        submitData.append("pdfFile", pdfFile);
      }
      if (quizData && formData.contentType === "test") {
        submitData.append("quizData", JSON.stringify(quizData));
      }
      
      // Need to include freeQuiz ID if editing so backend can update it
      if (isEdit && formData.freeQuiz) {
        submitData.append("freeQuiz", formData.freeQuiz);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEdit) {
        await axiosInstance.put(`/free-content/${id}`, submitData, config);
      } else {
        await axiosInstance.post("/free-content", submitData, config);
      }
      navigate("/free-content");
    } catch (error) {
      console.error("Error saving content", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title={`${isEdit ? "Edit" : "Add"} Free Content | Happy Life`}
        description="Manage Free Content."
      />
      <PageBreadcrumb pageTitle={`${isEdit ? "Edit" : "Add"} Free Content`} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              rows={4}
            />
          </div>

          <div>
            <Label>Thumbnail Image</Label>
            <FileInput onChange={handleFileChange} />
            {thumbnailPreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Thumbnail Preview</p>
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-32 rounded-lg object-cover" />
              </div>
            )}
          </div>
          <div>
            <Label>Content Type</Label>
            <select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900"
            >
              <option value="pdf">PDF</option>
              <option value="class">Video Class</option>
              <option value="test">Test (Quiz)</option>
            </select>
          </div>

          {formData.contentType === "pdf" && (
            <div>
              <Label>Upload PDF File</Label>
              <FileInput onChange={handlePdfFileChange} accept=".pdf" />
              {formData.fileUrl && !pdfFile && (
                <p className="text-sm text-gray-500 mt-2">
                  Current File: <a href={`${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${formData.fileUrl}`} target="_blank" rel="noreferrer" className="text-brand-500 underline">View PDF</a>
                </p>
              )}
            </div>
          )}

          {formData.contentType === "class" && (
            <div>
              <Label>Video URL</Label>
              <Input
                type="text"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">Provide YouTube, Vimeo, MP4 or VdoCipher URL.</p>
            </div>
          )}

          {formData.contentType === "test" && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Quiz Settings</h4>
                  <p className="text-sm text-gray-500">
                    {quizData ? `Configured with ${quizData.sections?.length || 0} sections` : "No quiz configured yet"}
                  </p>
                </div>
                <Button type="button" size="sm" onClick={() => setShowQuizModal(true)}>
                  {quizData ? "Edit Quiz" : "Create Quiz"}
                </Button>
              </div>
            </div>
          )}

          {(formData.contentType === "pdf" || formData.contentType === "class") && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDownloadable"
                id="isDownloadable"
                checked={formData.isDownloadable}
                onChange={handleChange}
                className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
              <Label htmlFor="isDownloadable" className="mb-0">Allow Download (Only works for direct MP4 links and PDFs)</Label>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
            />
            <Label htmlFor="isActive" className="mb-0">Active</Label>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => navigate("/free-content")}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Content"}
            </Button>
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
