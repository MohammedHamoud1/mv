// src/pages/api/submit-report.js
import { supabase } from '../../lib/supabase'; // استيراد Supabase client

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    title, program_name, severity, vulnerable_url, description, steps_to_reproduce,
    cwe_id, cvss_score, proof_of_concept, impact_assessment, suggested_fix,
    reporter_name, reporter_uid, program_id
  } = req.body;

  // Basic validation
  if (!title || !program_name || !severity || !vulnerable_url || !description || !steps_to_reproduce || !reporter_uid) {
    return res.status(400).json({ error: 'Missing required report fields' });
  }

  try {
    // 1. Insert the new report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert([
        {
          title,
          program_name,
          severity,
          status: 'pending', // Default status
          bounty: 'N/A', // Default bounty
          reporter_name,
          reporter_uid,
          submitted_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          cvss_score: cvss_score ? parseFloat(cvss_score) : null,
          weakness: cwe_id,
          vulnerable_url,
          description,
          steps_to_reproduce,
          proof_of_concept,
          impact_assessment,
          suggested_fix,
        },
      ])
      .select(); // Select the inserted data

    if (reportError) {
      console.error("Supabase insert report error:", reportError);
      return res.status(500).json({ error: reportError.message });
    }

    // 2. Update programs_count for the related program
    if (program_id) {
      // Fetch current reports_count
      const { data: currentProgram, error: fetchProgramError } = await supabase
        .from('programs')
        .select('reports_count')
        .eq('id', program_id)
        .single();

      if (fetchProgramError || !currentProgram) {
        console.error("Error fetching program to update reports_count:", fetchProgramError);
        // Continue even if this update fails, report is still submitted
      } else {
        const { error: updateProgramError } = await supabase
          .from('programs')
          .update({ reports_count: (currentProgram.reports_count || 0) + 1 })
          .eq('id', program_id);

        if (updateProgramError) {
          console.error("Error updating program reports_count:", updateProgramError);
        }
      }
    }

    // 3. Add to hacktivity feed
    const { error: hacktivityError } = await supabase
      .from('hacktivity')
      .insert([
        {
          type: 'report_submitted',
          reporter_name,
          program_name,
          title,
          severity,
          bounty: 'N/A',
          timestamp: new Date().toISOString(),
          reporter_uid,
        },
      ]);

    if (hacktivityError) {
      console.error("Supabase insert hacktivity error:", hacktivityError);
      // This is a background update, can fail gracefully without affecting main report submission
    }

    return res.status(200).json({ message: 'Report submitted successfully!', report: report[0] });
  } catch (error) {
    console.error("API error submitting report:", error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
