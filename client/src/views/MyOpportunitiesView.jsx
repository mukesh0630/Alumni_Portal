import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle2, XCircle, FileEdit, Trash2, Eye } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MyOpportunitiesView = () => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOpportunities();
  }, []);

  const fetchMyOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOpportunities(currentUser.id);
      if (res.success) setOpportunities(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <span className="badge badge-draft text-[10px] font-bold"><FileEdit className="w-3 h-3" /> Draft</span>;
      case 'pending':
        return <span className="badge badge-pending text-[10px] font-bold"><Clock className="w-3 h-3" /> Pending Approval</span>;
      case 'approved':
        return <span className="badge badge-approved text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="badge badge-rejected text-[10px] font-bold"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="badge badge-draft text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-6 h-6 text-cyan-400" />
          <h1 className="text-3xl font-extrabold text-white">My Posted Opportunities</h1>
        </div>
        <p className="text-xs text-slate-400">Track the status of all job opportunities you have posted. Approved posts are visible to students.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel animate-pulse space-y-3">
              <div className="h-5 w-48 bg-slate-800 rounded" />
              <div className="h-3 w-36 bg-slate-800/60 rounded" />
              <div className="h-3 w-24 bg-slate-800/40 rounded" />
              <div className="h-8 bg-slate-800/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 glass-panel space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-white">No Opportunities Posted Yet</p>
          <p className="text-xs text-slate-400">Click "Post Opportunity" in the sidebar to create your first job posting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {opportunities.map(opp => (
            <div key={opp.id} className="glass-panel space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{opp.title}</h3>
                  {getStatusBadge(opp.status)}
                </div>
                <p className="text-xs font-semibold text-violet-300">{opp.company}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{opp.location} • {opp.employmentType}</p>
                {opp.salary && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">{opp.salary}</p>
                )}
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                  {opp.description}
                </p>
                {opp.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {opp.skills.split(',').map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 mt-2">
                <span className="text-[10px] text-slate-500">
                  {opp.lastDate ? `Apply by: ${opp.lastDate}` : 'No deadline set'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {opp.vacancies} {Number(opp.vacancies) === 1 ? 'vacancy' : 'vacancies'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
