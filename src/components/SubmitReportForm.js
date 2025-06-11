// src/components/SubmitReportForm.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const SubmitReportForm = ({ preselectedProgram = null, programId = null }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_name: preselectedProgram || '',
    severity: '',
    title: '',
    cwe_id: '',
    cvss_score: '',
    vulnerable_url: '',
    description: '',
    steps_to_reproduce: '',
    proof_of_concept: '',
    impact_assessment: '',
    suggested_fix: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // For success/error messages

  useEffect(() => {
    // Fetch programs if not preselected
    const fetchPrograms = async () => {
      const { data, error } = await supabase.from('programs').select('id, name');
      if (error) {
        console.error("Error fetching programs:", error.message);
      } else {
        setPrograms(data);
      }
    };

    if (!preselectedProgram) {
      fetchPrograms();
    } else {
      // If preselected, set the program in formData
      setFormData(prev => ({ ...prev, program_name: preselectedProgram }));
    }
  }, [preselectedProgram]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a report.' });
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.title || !formData.program_name || !formData.severity || !formData.vulnerable_url || !formData.description || !formData.steps_to_reproduce) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (marked with *).' });
      setLoading(false);
      return;
    }

    try {
      // Submit report via API Route
      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          reporter_name: user.name || user.email, // Use profile name or email
          reporter_uid: user.id, // Supabase Auth UID
          program_id: programId, // Pass program ID for updating count
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData({ // Clear form
          program_name: preselectedProgram || '',
          severity: '',
          title: '',
          cwe_id: '',
          cvss_score: '',
          vulnerable_url: '',
          description: '',
          steps_to_reproduce: '',
          proof_of_concept: '',
          impact_assessment: '',
          suggested_fix: '',
        });
        // Optionally redirect or update UI
        if (preselectedProgram) {
          // If submitted from program detail page, just show success message
          router.push(`/programs/${programId}`); // Optionally re-fetch data for program detail page if needed
        } else {
          router.push('/programs'); // Redirect to programs list
        }

      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit report.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
      console.error("Submit Report Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program *
              </label>
              <select 
                name="program_name"
                value={formData.program_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                disabled={!!preselectedProgram}
                required
              >
                <option value="">Select a program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.name}>{program.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity *
              </label>
              <select 
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select severity</option>
                <option value="critical">Critical (9.0-10.0)</option>
                <option value="high">High (7.0-8.9)</option>
                <option value="medium">Medium (4.0-6.9)</option>
                <option value="low">Low (0.1-3.9)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vulnerability Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief, descriptive title of the vulnerability"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CWE ID
              </label>
              <input
                type="text"
                name="cwe_id"
                value={formData.cwe_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., CWE-79"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVSS Score
              </label>
              <input
                type="number"
                name="cvss_score"
                value={formData.cvss_score}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="0.0 - 10.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vulnerable URL/Endpoint *
            </label>
            <input
              type="url"
              name="vulnerable_url"
              value={formData.vulnerable_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/vulnerable-endpoint"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vulnerability Description *
            </label>
            <textarea
              rows={6}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Detailed description of the vulnerability, including technical details and potential impact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Steps to Reproduce *
            </label>
            <textarea
              rows={8}
              name="steps_to_reproduce"
              value={formData.steps_to_reproduce}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="1. Navigate to https://example.com/login&#10;2. Enter malicious payload in username field&#10;3. Submit the form&#10;4. Observe the XSS execution"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof of Concept
            </label>
            <textarea
              rows={4}
              name="proof_of_concept"
              value={formData.proof_of_concept}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Include any code, screenshots, or other evidence"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impact Assessment *
            </label>
            <textarea
              rows={4}
              name="impact_assessment"
              value={formData.impact_assessment}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the potential impact of this vulnerability on the application and its users"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested Fix
            </label>
            <textarea
              rows={3}
              name="suggested_fix"
              value={formData.suggested_fix}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional: Suggest how to fix this vulnerability"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              disabled={loading}
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReportForm;
