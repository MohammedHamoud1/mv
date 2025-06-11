// src/pages/company-dashboard.js
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase'; // استيراد Supabase client

import {
  FileText, Briefcase, AlertTriangle
} from 'lucide-react';

export async function getServerSideProps() {
  // Fetch all programs and reports to be filtered on client-side based on user's company
  const { data: programs, error: programsError } = await supabase.from('programs').select('*');
  const { data: reports, error: reportsError } = await supabase.from('reports').select('*');

  if (programsError || reportsError) {
    console.error("Error fetching data for company dashboard:", programsError || reportsError);
    return { props: { programs: [], reports: [], error: (programsError || reportsError).message } };
  }

  return {
    props: {
      allPrograms: programs,
      allReports: reports,
    },
  };
}

const CompanyDashboardPage = ({ allPrograms, allReports, error }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State for company-specific data
  const [myCompanyPrograms, setMyCompanyPrograms] = useState([]);
  const [companyReports, setCompanyReports] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'company')) {
      router.push('/'); // Redirect if not a company user
    }

    if (user && user.role === 'company' && allPrograms && allReports) {
      const filteredPrograms = allPrograms.filter(p => p.company === user.company_name);
      setMyCompanyPrograms(filteredPrograms);

      const programNames = filteredPrograms.map(p => p.name);
      const filteredReports = allReports.filter(report => programNames.includes(report.program_name));
      setCompanyReports(filteredReports);
    }
  }, [user, loading, router, allPrograms, allReports]);

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Error loading dashboard data: {error}
        </div>
      </Layout>
    );
  }

  if (loading || (!user && !loading)) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          Loading or not authorized...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.company_name}'s Company Dashboard (UID: {user.id ? user.id.substring(0, 8) + '...' : 'N/A'})
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports Received</p>
                <p className="text-3xl font-bold text-indigo-600">{companyReports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programs Managed</p>
                <p className="text-3xl font-bold text-green-600">{myCompanyPrograms.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Reports</p>
                <p className="text-3xl font-bold text-red-600">
                  {companyReports.filter(r => r.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Reports Submitted to Your Programs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {companyReports.length === 0 ? (
              <p className="p-6 text-gray-600">No reports submitted to your programs yet.</p>
            ) : (
              companyReports.map(report => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 mb-1">{report.title}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{report.reporter_name}</span> reported on{' '}
                        <span className="font-medium">{report.program_name}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(report.submitted_at).toLocaleDateString()} | Last Activity: {new Date(report.last_activity).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'triaged' ? 'bg-purple-100 text-purple-800' :
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                      <button className="text-indigo-600 text-sm hover:underline mt-2">View Details</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDashboardPage;
