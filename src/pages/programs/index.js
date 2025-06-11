// src/pages/programs/index.js
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link'; // استخدام Link للتوجيه
import { supabase } from '../../lib/supabase'; // استيراد Supabase client
import { useAuth } from '../../context/AuthContext';

import {
  Search, Shield, Trophy, Users, DollarSign, Star, Clock, AlertTriangle,
  CheckCircle, XCircle, Eye, MessageSquare, Filter, Plus, Menu, X, Bell,
  User, Settings, Home, Info, Mail, UserPlus, Briefcase, Activity,
  BarChart3, FileText, Award, Globe, Zap, Target, Lock, BookOpen,
  ChevronRight, Github, Twitter, Linkedin, MapPin, Calendar, TrendingUp,
  Cpu, Database, Code, Server, ChevronDown, Heart, Flag, Share2
} from 'lucide-react';

// Get server-side props to fetch initial data
export async function getServerSideProps() {
  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('*');

  if (programsError) {
    console.error("Error fetching programs on server:", programsError);
    return { props: { programs: [], error: programsError.message } };
  }

  // Derive companies from programs on the server
  const uniqueCompaniesMap = new Map();
  programs.forEach(p => {
    if (!uniqueCompaniesMap.has(p.company)) {
      uniqueCompaniesMap.set(p.company, {
        name: p.company,
        description: p.description || '',
        logo: p.logo || p.company.substring(0, 2).toUpperCase(),
        totalPaid: '$0', // These would ideally come from the backend if aggregated
        criticalVulns: 0, // These would ideally come from the backend if aggregated
        programs: []
      });
    }
    const companyEntry = uniqueCompaniesMap.get(p.company);
    companyEntry.programs.push({ id: p.id, name: p.name, bountyRange: p.bounty_range });
  });
  const companies = Array.from(uniqueCompaniesMap.values());

  return {
    props: {
      programs: programs.map(p => ({
        ...p,
        // Ensure JSONB columns are parsed if fetched as strings by some environments
        vulnerability_types: p.vulnerability_types && typeof p.vulnerability_types === 'string' ? JSON.parse(p.vulnerability_types) : p.vulnerability_types,
        scope: p.scope && typeof p.scope === 'string' ? JSON.parse(p.scope) : p.scope,
      })),
      companies,
    },
  };
}

const ProgramsPage = ({ programs, companies, error }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBountyRange, setFilterBountyRange] = useState('all');

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Error loading programs: {error}
        </div>
      </Layout>
    );
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBounty = filterBountyRange === 'all' || 
      (filterBountyRange === 'low' && program.max_bounty < 5000) ||
      (filterBountyRange === 'medium' && program.max_bounty >= 5000 && program.max_bounty < 15000) ||
      (filterBountyRange === 'high' && program.max_bounty >= 15000);
    return matchesSearch && matchesBounty;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bug Bounty Programs</h1>
          <div className="flex items-center space-x-4">
            <select
              value={filterBountyRange}
              onChange={(e) => setFilterBountyRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Bounty Ranges</option>
              <option value="low">Under $5K</option>
              <option value="medium">$5K - $15K</option>
              <option value="high">$15K+</option>
            </select>
            {user?.role === 'researcher' && (
              <Link 
                href="/submit-report"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>Submit Report</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map(program => (
            <div key={program.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{program.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                    <Link
                      href={`/companies/${program.company.replace(/\s+/g, '-')}`} // Dynamic link to company page
                      className="text-sm text-gray-500 cursor-pointer hover:underline"
                    >
                      {program.company}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {program.is_new && ( // Use is_new from DB
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{program.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{program.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bounty Range</p>
                  <p className="text-sm font-medium text-green-600">{program.bounty_range}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Response</p>
                  <p className="text-sm font-medium text-gray-900">{program.average_time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Paid</p>
                  <p className="text-sm font-medium text-purple-600">{program.total_paid}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Researchers</p>
                  <p className="text-sm font-medium text-blue-600">{program.researchers_count}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vulnerability Types</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(program.vulnerability_types) && program.vulnerability_types.slice(0, 3).map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      {type}
                    </span>
                  ))}
                  {Array.isArray(program.vulnerability_types) && program.vulnerability_types.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-500 rounded">
                      +{program.vulnerability_types.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{program.reports_count} reports</span>
                  <span>{program.resolved_count} resolved</span>
                </div>
                <Link
                  href={`/programs/${program.id}`} // Dynamic link to program detail page
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  View Program
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProgramsPage;
