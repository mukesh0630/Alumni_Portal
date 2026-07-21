import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Clock, Users, Award, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const FacultyDashboardView = () => {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        api.getVerificationQueue(),
        api.getStats()
      ]);
      if (queueRes.success) setQueue(queueRes.data);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id, name) => {
    try {
      const res = await api.approveAlumni(id);
      if (res.success) {
        setQueue(prev => prev.filter(q => q.id !== id));
        showToast(`Approved ${name}! Profile is now live in Alumni Registry.`, 'success');
        if (stats) setStats({ ...stats, verifiedCount: stats.verifiedCount + 1, pendingCount: stats.pendingCount - 1 });
      }
    } catch (e) {
      showToast(`Failed to approve: ${e.message}`, 'error');
    }
  };

  const handleReject = async (id, name) => {
    try {
      const res = await api.rejectAlumni(id);
      if (res.success) {
        setQueue(prev => prev.filter(q => q.id !== id));
        showToast(`Rejected registration for ${name}.`, 'error');
        if (stats) setStats({ ...stats, pendingCount: stats.pendingCount - 1 });
      }
    } catch (e) {
      showToast(`Failed to reject: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : 'bg-red-950 border-red-500 text-red-200'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-6 h-6 text-pink-400" />
          <h1 className="text-3xl font-extrabold text-white">Faculty Verification Hub</h1>
        </div>
        <p className="text-xs text-slate-400">Review, verify, and approve new alumni registrations submitted by graduating students.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Verified Alumni</div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats ? stats.verifiedCount : '--'}</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pending Verification Queue</div>
          <div className="text-3xl font-extrabold text-amber-400">{queue.length}</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Combined Submissions</div>
          <div className="text-3xl font-extrabold text-violet-400">
            {stats ? stats.verifiedCount + queue.length : '--'}
          </div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="glass-panel p-0 overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Recent Alumni Registration Queue
          </h3>
          <span className="text-xs text-slate-400">{queue.length} applications pending</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold">Loading verification queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Queue is Clear!</div>
            <p className="text-xs text-slate-400">All submitted student alumni applications have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Alumnus Information</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Placement / Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Skills</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queue.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-9 h-9 rounded-xl object-cover border border-violet-500/40"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                        />
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.registerNumber} • {item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-violet-300">
                      Class of '{String(item.batch).slice(-2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.company}</div>
                      <div className="text-[10px] text-slate-400">{item.designation}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.location}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(item.id, item.name)}
                          className="btn btn-success text-xs py-1.5 px-3 font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.id, item.name)}
                          className="btn btn-danger text-xs py-1.5 px-2.5 font-bold"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
