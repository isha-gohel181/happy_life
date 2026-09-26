import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

export default function AddEditTestSeries() {
  const navigate = useNavigate();
  return (
    <div>
      <PageBreadcrumb pageTitle="Add/Edit Test Series" />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Test Series Builder</h2>
        <p className="text-gray-500 mb-6">The API for creating test series (like quizzes) is ready. The form builder will be integrated soon.</p>
        <button onClick={() => navigate('/test-series')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Back to List
        </button>
      </div>
    </div>
  );
}
