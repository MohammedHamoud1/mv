// src/pages/leaderboard.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase'; // استيراد Supabase client
import { Trophy } from 'lucide-react';

export async function getServerSideProps() {
  const { data: leaderboard, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('reputation', { ascending: false }); // Sort by reputation

  if (error) {
    console.error("Error fetching leaderboard on server:", error);
    return { props: { leaderboard: [], error: error.message } };
  }

  return {
    props: {
      initialLeaderboard: leaderboard,
    },
  };
}

const LeaderboardPage = ({ initialLeaderboard, error }) => {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);

  useEffect(() => {
    // Setup real-time listener for leaderboard
    const leaderboardChannel = supabase
      .channel('public:leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, payload => {
        // For simplicity, re-fetch or update based on event type
        // For a full production app, handle INSERT, UPDATE, DELETE specifically
        console.log('Leaderboard change detected:', payload);
        supabase
          .from('leaderboard')
          .select('*')
          .order('reputation', { ascending: false })
          .then(({ data, error }) => {
            if (error) console.error("Error re-fetching leaderboard:", error);
            else setLeaderboard(data);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leaderboardChannel);
    };
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
          Error loading leaderboard: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Security Researcher Leaderboard</h1>
          <p className="text-lg text-gray-600">Top security researchers making the internet safer</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Rank</div>
              <div>Researcher</div>
              <div>Reputation</div>
              <div>Reports</div>
              <div>Bounties</div>
              <div>Country</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {leaderboard.length === 0 ? (
              <p className="p-6 text-gray-600 text-center">No leaderboard data to display.</p>
            ) : (
              leaderboard.map(researcher => (
                <div key={researcher.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        researcher.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        researcher.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        researcher.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        #{researcher.rank}
                      </div>
                      {researcher.rank <= 3 && (
                        <Trophy className={`h-5 w-5 ${
                          researcher.rank === 1 ? 'text-yellow-500' :
                          researcher.rank === 2 ? 'text-gray-400' :
                          'text-orange-500'
                        }`} />
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-900">{researcher.name}</div>
                      <div className="text-sm text-gray-500">@{researcher.username}</div>
                    </div>
                    
                    <div className="font-bold text-indigo-600">{researcher.reputation.toLocaleString()}</div>
                    <div className="font-semibold text-gray-900">{researcher.reports_count}</div>
                    <div className="font-bold text-green-600">${researcher.bounties_total.toLocaleString()}</div>
                    <div className="text-gray-600">{researcher.country}</div>
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

export default LeaderboardPage;
