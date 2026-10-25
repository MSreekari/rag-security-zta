import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  Shield,
  AlertOctagon,
  FileSpreadsheet,
  FileCode,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/audit/metrics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch SIEM metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans antialiased space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Link
            to="/chat"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Shield className="text-[#814AC8]" size={24} />
              SIEM Telemetry & Zero Trust Audit Dashboard
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Continuous Risk Trajectory, Event Telemetry & Forensic Log Reporting
            </p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            title="Refresh Metrics"
          >
            <RefreshCw size={16} />
          </button>
          <a
            href="http://127.0.0.1:8000/api/v1/audit/download/csv"
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold transition"
          >
            <FileSpreadsheet size={15} /> Export CSV Report
          </a>
          <a
            href="http://127.0.0.1:8000/api/v1/audit/download/jsonl"
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition"
          >
            <FileCode size={15} /> Download Raw JSONL
          </a>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Total Queries Logged
          </span>
          <p className="text-3xl font-bold font-mono text-zinc-100">{data?.total_queries || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-500">
            Compliant (ALLOW)
          </span>
          <p className="text-3xl font-bold font-mono text-emerald-400">{data?.decisions?.ALLOW || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-red-500">
            Blocked / Denied (DENY)
          </span>
          <p className="text-3xl font-bold font-mono text-red-400">{data?.decisions?.DENY || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-amber-500">
            DLP Sanitized (REDACT)
          </span>
          <p className="text-3xl font-bold font-mono text-amber-400">{data?.decisions?.REDACT || 0}</p>
        </div>
      </div>

      {/* Dynamic Risk Progression Graph */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-200">
              <AlertOctagon size={16} className="text-amber-400" />
              Dynamic Anomaly & Risk Score Trajectory
            </h2>
            <p className="text-[11px] text-zinc-500">
              Progression of cumulative risk points per query event sequence. Threshold &ge; 3.0 triggers quarantine.
            </p>
          </div>
          <span className="text-[11px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
            Lockout Limit: 3.0
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.risk_timeline || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="sequence" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" domain={[0, 4]} allowDecimals={false} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(val, name, item) => [
                  `Risk Score: ${val}`,
                  `User: ${item.payload.user_id} (${item.payload.decision})`,
                ]}
              />
              <ReferenceLine
                y={3}
                label={{ value: 'QUARANTINE (3.0)', fill: '#ef4444', fontSize: 10, position: 'top' }}
                stroke="#ef4444"
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="risk_score"
                stroke="#814AC8"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#814AC8', fill: '#09090b', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;