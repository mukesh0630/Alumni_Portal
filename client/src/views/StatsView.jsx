import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

export const StatsView = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.getStats();
      if (res.success) setStats(res.stats);
    } catch (e) {
      console.error(e);
    }
  };

  if (!stats) {
    return <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading metrics dashboard...</div>;
  }

  // Format batch data for AreaChart
  const batchData = Object.keys(stats.batchDistribution || {})
    .sort((a, b) => Number(a) - Number(b))
    .map(batch => ({
      batch: `'${batch.slice(-2)}`,
      count: stats.batchDistribution[batch]
    }));

  // Format region data for PieChart
  const regionData = Object.keys(stats.regionDistribution || {}).map(region => ({
    name: region,
    value: stats.regionDistribution[region]
  }));

  // Format company data for BarChart
  const companyData = Object.keys(stats.companyDistribution || {})
    .map(company => ({
      company,
      graduates: stats.companyDistribution[company]
    }))
    .sort((a, b) => b.graduates - a.graduates)
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Metrics Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Historical data, placement distributions, and geographic reach for the CS Department.</p>
      </div>

      {/* Metric Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Verified Registry</div>
          <div className="text-3xl font-extrabold text-violet-400">{stats.verifiedCount}</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unique Recruiters</div>
          <div className="text-3xl font-extrabold text-pink-400">{stats.uniqueCompaniesCount}</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Countries Spread</div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.uniqueRegionsCount}</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Active Mentors</div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.mentorsCount}</div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Growth */}
        <div className="glass-panel lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white">Graduates Growth Over Batches</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={batchData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="batch" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Spread */}
        <div className="glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">Global Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Companies */}
      <div className="glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white">Top Recruiter Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyData} layout="vertical">
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="company" type="category" stroke="#64748b" fontSize={11} width={90} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Bar dataKey="graduates" fill="#ec4899" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
