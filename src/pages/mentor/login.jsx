import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const MentorLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [rawResponse, setRawResponse] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRawResponse('');

    try {
      const response = await fetch('/api/mentor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const text = await response.text();
      setRawResponse(text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        setError(`Server returned HTML instead of JSON (status ${response.status}). Please try again or use Troubleshoot.`);
        return;
      }

      if (response.ok && data.success) {
        // Store mentor data in localStorage
        const mentorData = data.mentor || data.data;
        if (mentorData) {
          localStorage.setItem('mentorUserId', mentorData.id);
          localStorage.setItem('mentorName', mentorData.name);
          localStorage.setItem('mentorEmail', mentorData.email);
          localStorage.setItem('mentorSubject', mentorData.subject || '');
          localStorage.setItem('userId', mentorData.id);
          localStorage.setItem('authToken', 'mentor-token-' + Date.now());
        }
        router.push('/mentor/dashboard');
      } else {
        setError(data.message || data.error || `Login failed (status ${response.status})`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkServer = async () => {
    setServerStatus({ checking: true });
    try {
      const res = await fetch('/api/health/mentor-db');
      const data = await res.json();
      setServerStatus({ ok: res.ok, status: res.status, data });
    } catch (e) {
      setServerStatus({ ok: false, status: 'network-failed', message: e.message });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <span className="text-white text-2xl">🎓</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">Mentor Login</h1>
          <p className="mt-1 text-slate-400">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-400 rounded-lg px-4 py-3 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-400 rounded-lg px-4 py-3 transition"
                  placeholder="Your secure password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Authenticating…' : 'Access Dashboard'}
            </button>
          </form>

          {/* Troubleshoot */}
          <div className="mt-6">
            <button
              onClick={() => setShowTroubleshoot(v => !v)}
              className="text-sm text-slate-400 hover:text-white underline"
            >
              {showTroubleshoot ? 'Hide' : 'Show'} Troubleshoot
            </button>

            {showTroubleshoot && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <button onClick={checkServer} className="px-3 py-2 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">Check API & DB</button>
                  <span className="text-xs text-slate-400">Verifies Vercel ↔ Neon connectivity</span>
                </div>
                {serverStatus && (
                  <pre className="text-xs whitespace-pre-wrap bg-black/40 border border-slate-800 rounded-md p-3 text-slate-300 max-h-48 overflow-auto">{JSON.stringify(serverStatus, null, 2)}</pre>
                )}
                {rawResponse && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-slate-400">Raw server response</summary>
                    <pre className="mt-2 whitespace-pre-wrap bg-black/40 border border-slate-800 rounded-md p-3 text-slate-300 max-h-48 overflow-auto">{rawResponse}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-slate-500 text-xs">© {new Date().getFullYear()} Knowtasks — Mentor Portal</p>
      </div>
    </div>
  );
};

export default MentorLogin;
