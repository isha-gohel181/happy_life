import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchEbooks, deleteEbook } from "../../store/slices/ebook";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Ebook {
  _id: string;
  title: string;
  description: string;
  price: number;
  author: string;
  isActive: boolean;
  createdAt: string;
}

const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ebook: Ebook | null;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, ebook, isDeleting }) => {
  if (!isOpen || !ebook) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-transparent backdrop-blur-xs transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Ebook</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="p-6">
            <p>Are you sure you want to delete "{ebook.title}"?</p>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 border rounded-md">Cancel</button>
            <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EbookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: ebookData, loading, error } = useAppSelector((state) => state.ebook);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Ebook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEbooks());
  }, [dispatch]);

  useEffect(() => {
    const items = ebookData?.ebooks || ebookData?.data || [];
    if (Array.isArray(items)) {
      let filtered = items;
      if (searchInput) {
        filtered = filtered.filter((q: Ebook) =>
          q.title?.toLowerCase().includes(searchInput.toLowerCase())
        );
      }
      setFilteredEbooks(filtered);
    }
  }, [ebookData, searchInput]);

  const openDeleteModal = (item: Ebook) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await dispatch(deleteEbook(itemToDelete._id)).unwrap();
        toast.success("Ebook deleted successfully");
        closeDeleteModal();
        dispatch(fetchEbooks());
      } catch (error) {
        toast.error("Failed to delete Ebook");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Ebook List" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ebooks</h1>
          <button onClick={() => navigate("/ebooks/add")} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            + Add Ebook
          </button>
        </div>
        <div className="bg-white shadow p-4 rounded-md mb-6 dark:bg-gray-900">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredEbooks.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-sm">{item.author || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => navigate(`/ebooks/edit/${item._id}`)} className="text-blue-500 hover:text-blue-700">
                      <Pencil className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => openDeleteModal(item)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} ebook={itemToDelete} isDeleting={isDeleting} />
    </div>
  );
};
export default EbookList;
