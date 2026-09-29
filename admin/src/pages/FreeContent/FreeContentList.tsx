import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import axiosInstance from "../../services/axiosConfig";

export default function FreeContentList() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/free-content");
      if (data.success) {
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error("Error fetching free content", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await axiosInstance.delete(`/free-content/${id}`);
        fetchContents();
      } catch (error) {
        console.error("Error deleting content", error);
      }
    }
  };

  return (
    <>
      <PageMeta
        title="Free Content | OS Academy"
        description="Manage Free Content."
      />
      <PageBreadcrumb pageTitle="Free Content" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Free Content List
          </h3>
          <div className="flex gap-4">
            {contents.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                <option value="">All Types</option>
                {Array.from(new Set(contents.map((c: any) => c.contentType))).map(type => (
                  <option key={type as string} value={type as string}>
                    {(type as string).toUpperCase()}
                  </option>
                ))}
              </select>
            )}
            <Link
              to="/free-content/add"
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <PlusIcon />
              Add Content
            </Link>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents
                  .filter((item: any) => selectedType ? item.contentType === selectedType : true)
                  .map((item: any) => (
                  <tr key={item._id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 uppercase">{item.contentType}</td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-500">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/free-content/edit/${item._id}`)}
                        className="text-brand-500 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
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
