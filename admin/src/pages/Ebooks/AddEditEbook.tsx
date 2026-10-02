import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";
import FileInput from "../../components/form/input/FileInput";

export default function AddEditEbook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    author: "",
    isActive: true,
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchEbook();
    }
  }, [id]);

  const fetchEbook = async () => {
    try {
      const { data } = await axiosInstance.get(`/ebooks/${id}`);
      if (data.success) {
        setFormData({
          title: data.ebook.title,
          description: data.ebook.description,
          price: data.ebook.price,
          author: data.ebook.author,
          isActive: data.ebook.isActive,
        });
        if (data.ebook.coverImage) {
          setCoverImagePreview(`${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${data.ebook.coverImage}`);
        }
      }
    } catch (error) {
      console.error("Error fetching ebook", error);
      toast.error("Failed to fetch ebook details");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", String(formData.price));
      submitData.append("author", formData.author);
      submitData.append("isActive", String(formData.isActive));

      if (coverImageFile) {
        submitData.append("coverImage", coverImageFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEdit) {
        await axiosInstance.put(`/ebooks/${id}`, submitData, config);
        toast.success("Ebook updated successfully!");
      } else {
        await axiosInstance.post("/ebooks", submitData, config);
        toast.success("Ebook created successfully!");
      }
      navigate("/ebooks");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save Ebook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title={`${isEdit ? 'Edit' : 'Add'} Book | Happy Life`} description="Manage Book" />
      <PageBreadcrumb pageTitle={`${isEdit ? 'Edit' : 'Add'} Book`} />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Ebook Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (INR)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <FileInput onChange={handleCoverImageChange} accept="image/*" />
            {coverImagePreview && (
              <div className="mt-4">
                <img src={coverImagePreview} alt="Cover Preview" className="h-32 rounded-lg object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
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
            <button type="button" onClick={() => navigate("/ebooks")} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
