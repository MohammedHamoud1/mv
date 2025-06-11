// src/pages/hacktivity.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase'; // استيراد Supabase client
import {
  DollarSign, CheckCircle
} from 'lucide-react';

export async function getServerSideProps() {
  const { data: hacktivity, error } = await supabase
    .from('hacktivity')
    .select('*')
    .order('timestamp', { ascending: false }); // Sort by timestamp

  if (error) {
    console.error("Error fetching hacktivity on server:", error);
    return { props: { hacktivity: [], error: error.message } };
  }

  return {
    props: {
      initialHacktivity: hacktivity,
    },
  };
}

const HacktivityPage = ({ initialHacktivity, error }) => {
  const [hacktivity, setHacktivity] = useState(initialHacktivity);
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    // Setup real-time listener for hacktivity
    const hacktivityChannel = supabase
      .channel('public:hacktivity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hacktivity' }, payload => {
        // Add new item to the top of the list
        setHacktivity(prev => [payload.new, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(hacktivityChannel);
    };
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Error loading hacktivity: {error}
        </div>
      </Layout>
    );
  }

  const filteredHacktivity = hacktivity.filter(activity => {
    return filterSeverity === 'all' || activity.severity === filterSeverity;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Hacktivity</h1>
          <div className="flex items-center space-x-4">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredHacktivity.length === 0 ? (
              <p className="p-6 text-gray-600 text-center">No hacktivity to display.</p>
            ) : (
              filteredHacktivity.map(activity => (
                <div key={activity.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'bounty_awarded' ? (
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'bounty_awarded' ? 'Bounty Awarded' : 'Report Submitted'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            activity.severity === 'critical' ? 'text-red-600 bg-red-100' :
                            activity.severity === 'high' ? 'text-orange-600 bg-orange-100' :
                            activity.severity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-blue-600 bg-blue-100'
                          }`}>
                            {activity.severity}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{activity.reporter_name}</span> {activity.type === 'bounty_awarded' ? 'was awarded a bounty for' : 'submitted a report on'} <span className="font-medium">{activity.program_name}</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-2">{activity.title}</p>
                      {activity.bounty && (
                        <p className="text-lg font-bold text-green-600 mt-2">{activity.bounty}</p>
                      )}
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

export default HacktivityPage;
