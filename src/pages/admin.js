// src/pages/admin.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase'; // Import Supabase for data counts

import {
  Briefcase, FileText, Users
} from 'lucide-react';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [programsCount, setProgramsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [researchersCount, setResearchersCount] = useState(0);

  // Admin form states
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newProgramName, setNewProgramName] = useState('');
  const [newMinBounty, setNewMinBounty] = useState('');
  const [newMaxBounty, setNewMaxBounty] = useState('');
  const [newProgramDescription, setNewProgramDescription] = useState('');
  const [formMessage, setFormMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/'); // Redirect if not admin
    }

    const fetchDataCounts = async () => {
      const { count: pCount, error: pError } = await supabase.from('programs').select('*', { count: 'exact', head: true });
      const { count: rCount, error: rError } = await supabase.from('reports').select('*', { count: 'exact', head: true });
      const { count: lCount, error: lError } = await supabase.from('leaderboard').select('*', { count: 'exact', head: true });

      if (pError) console.error("Error fetching programs count:", pError.message);
      if (rError) console.error("Error fetching reports count:", rError.message);
      if (lError) console.error("Error fetching researchers count:", lError.message);

      setProgramsCount(pCount || 0);
      setReportsCount(rCount || 0);
      setResearchersCount(lCount || 0);
    };

    if (user?.role === 'admin') {
      fetchDataCounts();
    }
  }, [user, loading, router]);


  const handleAddProgram = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    const newProgramData = {
      name: newProgramName,
      company: newCompanyName,
      min_bounty: parseFloat(newMinBounty),
      max_bounty: parseFloat(newMaxBounty),
      description: newProgramDescription,
      logo: newCompanyName.substring(0,2).toUpperCase(), // Simple logo
      bounty_range: `$${newMinBounty} - $${newMaxBounty}`,
      is_new: true,
      launched_at: new Date().toISOString(),
      vulnerability_types: [], // Can be extended
      scope: [], // Can be extended
    };

    try {
      const response = await fetch('/api/add-program', { // Using API Route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProgramData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormMessage({ type: 'success', text: data.message });
        setNewCompanyName('');
        setNewProgramName('');
        setNewMinBounty('');
        setNewMaxBounty('');
        setNewProgramDescription('');
        // Re-fetch counts after adding a program
        const { count: pCount } = await supabase.from('programs').select('*', { count: 'exact', head: true });
        setProgramsCount(pCount || 0);
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to add program.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
      console.error("Add Program Error:", err);
    } finally {
      setFormLoading(false);
    }
  };


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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Programs</p>
                <p className="text-3xl font-bold text-indigo-600">{programsCount}</p>
              </div>
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-green-600">{reportsCount}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Researchers</p>
                <p className="text-3xl font-bold text-purple-600">{researchersCount}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Program</h2>
          </div>
          
          <form onSubmit={handleAddProgram} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input 
                type="text" 
                required
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                placeholder="e.g., Google"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Name *</label>
              <input 
                type="text" 
                required
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                placeholder="e.g., Android Security Rewards"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Bounty *</label>
              <input 
                type="number" 
                required
                min="0"
                value={newMinBounty}
                onChange={(e) => setNewMinBounty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                placeholder="e.g., 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Bounty *</label>
              <input 
                type="number" 
                required
                min="0"
                value={newMaxBounty}
                onChange={(e) => setNewMaxBounty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                placeholder="e.g., 10000"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                rows={3} 
                required
                value={newProgramDescription}
                onChange={(e) => setNewProgramDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                placeholder="Brief description of the program"
              />
            </div>

            {formMessage && (
              <div className={`md:col-span-2 p-3 rounded-lg ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formMessage.text}
              </div>
            )}
            
            <div className="md:col-span-2">
              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? 'Adding Program...' : 'Add Program'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
