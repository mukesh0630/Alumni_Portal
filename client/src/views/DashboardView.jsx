import React, { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, Award, Users, Globe2, Building2, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { AlumniCard } from '../components/AlumniCard';

export const DashboardView = ({ setActiveView, onSelectProfile }) => {
  const [stats, setStats] = useState(null);
  const [featuredAlumni, setFeaturedAlumni] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, alumniRes] = await Promise.all([
        api.getStats(),
        api.getAlumni({ distinguished: 'true' })
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (alumniRes.success) setFeaturedAlumni(alumniRes.data.slice(0, 3));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-r from-violet-950/80 via-slate-900 to-slate-950 border border-violet-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Department of Computer Science
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Connecting Pioneers, <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Shaping Futures.
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
            Welcome to the official Alumni Network of the B.Sc Computer Science Department, established in 1994. Discover where our graduates work, map successful careers, and request professional mentorship.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveView('directory')}
              className="btn btn-primary text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <span>Explore Alumni Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('about')}
              className="btn btn-secondary text-sm font-bold"
            >
              About Department
            </button>
          </div>
        </div>
      </div>

      {/* Info Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-violet-400 mb-1">
            {stats ? stats.totalAlumni : '--'}
          </div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Alumni</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-1">
            {stats ? stats.verifiedCount : '--'}
          </div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verified Registry</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-pink-400 mb-1">
            {stats ? stats.uniqueCompaniesCount : '--'}
          </div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Companies</div>
        </div>
        <div className="glass-panel text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">
            {stats ? stats.uniqueRegionsCount : '--'}
          </div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Global Regions</div>
        </div>
      </div>

      {/* Distinguished Pioneers */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Distinguished Pioneers</h2>
            <p className="text-xs text-slate-400 mt-1">Meet our featured alumni leading global innovation.</p>
          </div>
          <button
            onClick={() => setActiveView('hall-of-fame')}
            className="btn btn-secondary text-xs font-bold"
          >
            View Hall of Fame
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAlumni.map(al => (
            <AlumniCard key={al.id} alumnus={al} onSelectProfile={onSelectProfile} />
          ))}
        </div>
      </div>

      {/* Latest Success Stories */}
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Latest Success Stories</h2>
        <p className="text-xs text-slate-400 mb-6">Recent career transitions and milestones from our alumni network.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
              Career Transition
            </span>
            <h3 className="text-base font-bold text-white leading-snug">Aditya Saxena joins Intel R&D Division</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aditya (Batch of 2022) successfully transitioned into low-level hardware-software co-design at Intel Bengaluru after contributing to compiler firmware.
            </p>
          </div>
          <div className="glass-panel space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
              Mentorship Hub
            </span>
            <h3 className="text-base font-bold text-white leading-snug">Department Sandbox Funded by Accenture MD</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Karthik Swamy (Batch of 2008) recently funded a Department AI Sandbox project to provide cloud infrastructure for final-year capstone projects.
            </p>
          </div>
          <div className="glass-panel space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              SaaS Growth
            </span>
            <h3 className="text-base font-bold text-white leading-snug">Zoho Schools Program Recruits B.Sc Candidates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under Vikram Malhotra (Batch of 2012), Zoho established direct campus recruitment pipelines, verifying 30+ alumni inside Zoho Desk teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
