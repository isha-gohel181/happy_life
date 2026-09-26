import React from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

export default function TestSeriesList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Test Series" />
      <div className="flex justify-end mb-4">
        <Link to="/test-series/add" className="bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600">
          Add Test Series
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Test Series Management</h2>
        <p className="text-gray-500">The API is ready. The frontend list table is under construction and will be integrated soon.</p>
      </div>
    </div>
  );
}
