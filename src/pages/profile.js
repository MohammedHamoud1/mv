// src/pages/profile.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

import {
  User
} from 'lucide-react';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userReports, setUserReports] = useState([]);
  const [bountiesEarned, setBountiesEarned] = useState(0);
  const [criticalFindings, setCriticalFindings] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchUserReports = async () => {
      if (user) {
        const { data: reports, error } = await supabase
          .from('reports')
          .select('*')
          .eq('reporter_uid', user.id) // Filter reports by current user's Supabase UID
          .order('submitted_at', { ascending: false });

        if (error) {
          console.error("Error fetching user reports:", error.message);
          return;
        }
        setUserReports(reports);

        // Calculate bounties earned and critical findings
        let totalBounties = 0;
        let totalCritical = 0;
        reports.forEach(report => {
          if (report.bounty && report.bounty !== 'N/A') {
            const bountyValue = parseFloat(String(report.bounty).replace('$', '').replace(',', ''));
            if (!isNaN(bountyValue)) {
              totalBounties += bountyValue;
            }
          }
          if (report.severity === 'critical') {
            totalCritical += 1;
          }
        });
        setBountiesEarned(totalBounties);
        setCriticalFindings(totalCritical);
      }
    };

    if (user) {
      fetchUserReports();
    }
  }, [user, loading, router]);


  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          Loading user profile...
        </div>
      </Layout>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect above, but as a fallback
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Please log in to view your profile.
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
                <p className="text-indigo-100">
                  {user.role === 'researcher' ? 'Security Researcher' : 'Company Representative'}
                </p>
                {user.reputation && (
                  <p className="text-sm text-indigo-100 mt-1">Reputation: {user.reputation}</p>
                )}
                <p className="text-sm text-indigo-100 mt-1">UID: {user.id}</p> {/* Display Supabase UID */}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{userReports.length}</div>
                <div className="text-sm text-gray-600">Reports Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">${bountiesEarned.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Bounties Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{criticalFindings}</div>
                <div className="text-sm text-gray-600">Critical Findings</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {userReports.length === 0 ? (
                  <p className="text-gray-600">No recent reports.</p>
                ) : (
                  userReports.slice(0, 3).map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-600">
                          {report.program_name} • {new Date(report.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
