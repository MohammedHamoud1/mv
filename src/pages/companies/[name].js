// src/pages/companies/[name].js
import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

import {
  ChevronRight
} from 'lucide-react';

export async function getServerSideProps(context) {
  const { name } = context.query;
  const companyName = name.replace(/-/g, ' '); // Convert slug back to readable name

  // Fetch programs for this company
  const { data: companyPrograms, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('company', companyName);

  if (programsError) {
    console.error("Error fetching company programs:", programsError.message);
    return { props: { company: null, error: programsError.message } };
  }

  // Aggregate company data from its programs
  let companyData = {
    name: companyName,
    description: companyPrograms[0]?.description || '',
    logo: companyPrograms[0]?.logo || companyName.substring(0,2).toUpperCase(),
    totalPaid: 0,
    criticalVulns: 0,
    activeProgramsCount: companyPrograms.length,
    programs: companyPrograms.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      bountyRange: p.bounty_range
    }))
  };

  companyPrograms.forEach(p => {
    // Sum total paid (assuming string like '$X.XM' or '$XK')
    const paidMatch = String(p.total_paid).match(/\$(\d+(\.\d+)?)([MK])?/);
    if (paidMatch) {
      let value = parseFloat(paidMatch[1]);
      if (paidMatch[3] === 'M') value *= 1000000;
      if (paidMatch[3] === 'K') value *= 1000;
      companyData.totalPaid += value;
    }
    companyData.criticalVulns += p.critical_vulns || 0;
  });

  companyData.totalPaid = `$${(companyData.totalPaid / 1000000).toFixed(1)}M`;


  if (!companyPrograms.length) {
    // If no programs found, maybe it's a new company without programs yet
    // Or it means the company name is invalid
    // For now, return a basic company object if no programs
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, company_name')
      .eq('company_name', companyName)
      .single();

    if (profileData) {
      companyData = {
        name: companyName,
        description: `${companyName} is a new company on SecureBounty.`,
        logo: companyName.substring(0, 2).toUpperCase(),
        totalPaid: '$0M',
        criticalVulns: 0,
        activeProgramsCount: 0,
        programs: []
      };
    } else {
       return { notFound: true }; // Company not found
    }
  }

  return {
    props: {
      company: companyData,
    },
  };
}

const CompanyDetailPage = ({ company, error }) => {
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Error loading company: {error}
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          Company not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-white">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-indigo-700 shadow-md">
                {company.logo}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                <p className="text-blue-100 text-lg">{company.description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Total Bounties Paid</p>
                <p className="text-3xl font-bold text-green-600">{company.totalPaid}</p>
              </div>
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Critical Vulnerabilities</p>
                <p className="text-3xl font-bold text-red-600">{company.criticalVulns}</p>
              </div>
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Active Programs</p>
                <p className="text-3xl font-bold text-indigo-600">{company.activeProgramsCount}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Programs by {company.name}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {company.programs.map(program => (
                <div key={program.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-600">{program.bountyRange}</span>
                    <Link
                      href={`/programs/${program.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Program <ChevronRight className="inline-block h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetailPage;
