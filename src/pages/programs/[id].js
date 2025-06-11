// src/pages/programs/[id].js
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import SubmitReportForm from '../../components/SubmitReportForm'; // سنقوم بإنشاء هذا لاحقاً
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

import {
  Star
} from 'lucide-react';

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data: program, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !program) {
    console.error("Error fetching program:", error);
    return { notFound: true }; // Return 404 if program not found
  }

  // Ensure JSONB columns are parsed if fetched as strings by some environments
  const parsedProgram = {
    ...program,
    vulnerability_types: program.vulnerability_types && typeof program.vulnerability_types === 'string' ? JSON.parse(program.vulnerability_types) : program.vulnerability_types,
    scope: program.scope && typeof program.scope === 'string' ? JSON.parse(program.scope) : program.scope,
  };

  return {
    props: {
      program: parsedProgram,
    },
  };
}

const ProgramDetailPage = ({ program }) => {
  const { user } = useAuth();

  if (!program) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          Program not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-10 text-white">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-indigo-700 shadow-md">
                {program.logo}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{program.name}</h1>
                <p className="text-purple-100 text-lg">{program.company}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
            <p className="text-gray-700 mb-6">{program.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Bounty Range</p>
                <p className="text-lg font-semibold text-green-600">{program.bounty_range}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Average Time to Resolution</p>
                <p className="text-lg font-semibold text-gray-900">{program.average_time}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Total Bounties Paid</p>
                <p className="text-lg font-semibold text-purple-600">{program.total_paid}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Researchers</p>
                <p className="text-lg font-semibold text-blue-600">{program.researchers_count}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Critical Vulnerabilities</p>
                <p className="text-lg font-semibold text-red-600">{program.critical_vulns}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide">Rating</p>
                <p className="text-lg font-semibold text-yellow-500">{program.rating} <Star className="inline h-5 w-5 fill-current" /></p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Vulnerability Types</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.isArray(program.vulnerability_types) && program.vulnerability_types.map((type, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Scope</h3>
            <ul className="list-disc list-inside text-gray-700 mb-8 space-y-1">
              {Array.isArray(program.scope) && program.scope.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {/* Submit Report section for this specific program */}
            {user?.role === 'researcher' && (
              <div className="mt-12 bg-gray-50 rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Report for {program.name}</h2>
                <SubmitReportForm preselectedProgram={program.name} programId={program.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProgramDetailPage;
