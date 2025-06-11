// src/pages/submit-report.js
import React from 'react';
import Layout from '../components/Layout';
import SubmitReportForm from '../components/SubmitReportForm';

const SubmitReportPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit Vulnerability Report</h1>
        <SubmitReportForm />
      </div>
    </Layout>
  );
};

export default SubmitReportPage;
