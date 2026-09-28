import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTestSeries, deleteTestSeries } from "../../store/slices/testSeries";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router";

interface TestSeries {
  _id: string;
  title: string;
  description: string;
  price: number;
  totalMarks: number;
  timeLimit: number;
  level: string;
  isActive: boolean;
  createdAt: string;
}

const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testSeries: TestSeries | null;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, testSeries, isDeleting }) => {
  if (!isOpen || !testSeries) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex sm:flex-row items-center sm:items-center justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Test Series
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete test series{" "}
              <strong className="text-gray-900 dark:text-white">
                "{testSeries.title}"
              </strong>
              ?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestSeriesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: tsData,
    loading,
    error,
  } = useAppSelector((state) => state.testSeries);

  const [searchInput, setSearchInput] = useState("");
  const [filteredTestSeries, setFilteredTestSeries] = useState<TestSeries[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TestSeries | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchTestSeries());
  }, [dispatch]);

  useEffect(() => {
    // API returns { success: true, testSeries: [...] } typically, or data directly
    const items = tsData?.testSeries || tsData?.data || [];
    if (Array.isArray(items)) {
      let filtered = items;
      if (searchInput) {
        filtered = filtered.filter((q: TestSeries) =>
          q.title?.toLowerCase().includes(searchInput.toLowerCase())
        );
      }
      setFilteredTestSeries(filtered);
    }
  }, [tsData, searchInput]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredTestSeries.length / limit)) {
      setPage(newPage);
    }
  };

  const openDeleteModal = (item: TestSeries) => {
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
        await dispatch(deleteTestSeries(itemToDelete._id)).unwrap();
        toast.success("Test Series deleted successfully");
        closeDeleteModal();
        dispatch(fetchTestSeries());
      } catch (error) {
        toast.error("Failed to delete Test Series");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <PageMeta title="Test Series List | LMS Admin" description="List of all test series" />
      <PageBreadcrumb pageTitle="Test Series List" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Test Series</h1>
          <button onClick={() => navigate("/test-series/add")} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            + Add Test Series
          </button>
        </div>

        <div className="bg-white shadow p-4 rounded-md mb-6 dark:bg-gray-900">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setSearchInput("")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTestSeries.slice((page - 1) * limit, page * limit).map((item, idx) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm capitalize">{item.level}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => navigate(`/test-series/edit/${item._id}`)} className="text-blue-500 hover:text-blue-700">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => openDeleteModal(item)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} testSeries={itemToDelete} isDeleting={isDeleting} />
    </div>
  );
};
export default TestSeriesList;
