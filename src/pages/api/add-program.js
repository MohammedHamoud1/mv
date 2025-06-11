// src/pages/api/add-program.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    name, company, logo, bounty_range, min_bounty, max_bounty,
    vulnerability_types, scope, reports_count, resolved_count, average_time,
    rating, status, is_new, launched_at, description, total_paid, researchers_count, critical_vulns
  } = req.body;

  // Basic validation
  if (!name || !company || !min_bounty || !max_bounty || !description) {
    return res.status(400).json({ error: 'Missing required program fields' });
  }

  try {
    const { data, error } = await supabase
      .from('programs')
      .insert([
        {
          name,
          company,
          logo: logo || company.substring(0,2).toUpperCase(),
          bounty_range: bounty_range || `$${min_bounty} - $${max_bounty}`,
          min_bounty,
          max_bounty,
          vulnerability_types: vulnerability_types || [],
          scope: scope || [],
          reports_count: reports_count || 0,
          resolved_count: resolved_count || 0,
          average_time: average_time || 'N/A',
          rating: rating || 0.0,
          status: status || 'active',
          is_new: is_new !== undefined ? is_new : true,
          launched_at: launched_at || new Date().toISOString(),
          description,
          total_paid: total_paid || '$0',
          researchers_count: researchers_count || 0,
          critical_vulns: critical_vulns || 0,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert program error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Program added successfully!', program: data[0] });
  } catch (error) {
    console.error("API error adding program:", error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
