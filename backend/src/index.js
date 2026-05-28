/**
 * Cloudflare Worker Backend for Criptana 360
 * Handles newsletter subscriptions and writes directly to Cloudflare D1 SQL database.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS headers for cross-domain calls
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only allow POST requests to /api/subscribe
    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, lang } = body;

        // Basic validations
        if (!email) {
          return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Get Client IP address for auditing/spam prevention
        const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

        // Write directly to the D1 Database binding
        // The D1 binding is named "DB" in wrangler.toml
        const result = await env.DB.prepare(
          `INSERT OR IGNORE INTO subscribers (email, lang, ip_address) VALUES (?, ?, ?)`
        ).bind(email, lang || 'es', clientIp).run();

        return new Response(JSON.stringify({ success: true, message: 'Subscriber saved successfully!' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Database transaction failed', details: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Default response for other endpoints
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
