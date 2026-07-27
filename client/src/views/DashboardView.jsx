import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Briefcase, Award, Users, Globe2, Building2, CheckCircle2, Sparkles, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { api } from '../services/api';
import { AlumniCard } from '../components/AlumniCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorBanner } from '../components/ErrorBanner';

export const DashboardView = ({ setActiveView, onSelectProfile, onApplyOpportunity }) => {
  const [stats, setStats] = useState(null);
  const [featuredAlumni, setFeaturedAlumni] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, alumniRes, oppRes] = await Promise.all([
        api.getStats(),
        api.getAlumni({ distinguished: 'true' }),
        api.getOpportunities()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (alumniRes.success) setFeaturedAlumni(alumniRes.data.slice(0, 3));
      if (oppRes.success) setOpportunities(oppRes.data);
    } catch (e) {
      console.error(e);
      setError('Unable to load dashboard data. The server may be offline.');
    } finally {
      setLoading(false);
    }
  };

  const scrollOpportunities = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleApply = (opp) => {
    if (onApplyOpportunity) {
      onApplyOpportunity(opp);
    } else {
      alert(`Interest expressed for: ${opp.title} (${opp.company}). The alumnus contact will be emailed to your account!`);
    }
  };

  if (error) {
    return (
      <div className="space-y-12 animate-fade-in">
        <ErrorBanner message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden hero-glow-card">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none hidden lg:block" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg shadow-violet-950/50">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>B.Sc Computer Science Department • Est. 1994</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            Connecting Pioneers, <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-glow-violet">
              Shaping Futures.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-medium">
            Discover 30+ years of tech legacy. Connect with top tech leaders at Google, Microsoft, Amazon, Zoho, and Intel. Request mentorship, explore career paths, and collaborate.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveView('directory')}
              className="btn btn-primary text-base font-bold px-6 py-3 flex items-center gap-2.5 rounded-xl"
            >
              <span>Explore Alumni Directory</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('ai-assistant')}
              className="btn btn-secondary text-base font-bold px-6 py-3 flex items-center gap-2.5 rounded-xl border-violet-500/30 hover:border-violet-500"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Ask AI Career Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {loading ? (
          <LoadingSkeleton variant="stat" count={4} />
        ) : (
          <>
            <div className="glass-panel text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-black text-violet-400 mb-1 tracking-tight">
                {stats ? stats.totalAlumni : '500+'}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Alumni</div>
            </div>
            <div className="glass-panel text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-black text-emerald-400 mb-1 tracking-tight">
                {stats ? stats.verifiedCount : '100%'}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Registry</div>
            </div>
            <div className="glass-panel text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-black text-pink-400 mb-1 tracking-tight">
                {stats ? stats.uniqueCompaniesCount : '45+'}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Global Companies</div>
            </div>
            <div className="glass-panel text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-black text-cyan-400 mb-1 tracking-tight">
                {stats ? stats.uniqueRegionsCount : '12+'}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Countries & Regions</div>
            </div>
          </>
        )}
      </div>

      {/* Recommended Opportunities for Students (Sliding Carousel) */}
      <div className="relative bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-slate-950/40 rounded-3xl p-6 border border-violet-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Recommended Opportunities for Students
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Direct referrals, internships, and mentorship openings sponsored by department alumni.
            </p>
          </div>

          {/* Sliding Carousel Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollOpportunities('left')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-violet-600 text-white border border-slate-700 hover:border-violet-500 transition-all shadow-md"
              title="Slide Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollOpportunities('right')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-violet-600 text-white border border-slate-700 hover:border-violet-500 transition-all shadow-md"
              title="Slide Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sliding Horizontal Wrapper */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-hidden"
        >
          {loading ? (
            <LoadingSkeleton variant="card" count={3} />
          ) : (
            opportunities.map(opp => (
              <OpportunityCard key={opp.id} opp={opp} onApply={handleApply} />
            ))
          )}
        </div>
      </div>

      {/* Distinguished Pioneers */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Distinguished Hall of Fame</h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Leading software architects, engineering directors, and founders.</p>
          </div>
          <button
            onClick={() => setActiveView('hall-of-fame')}
            className="btn btn-secondary text-xs font-bold px-4 py-2"
          >
            View All Hall of Fame
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <LoadingSkeleton variant="card" count={3} />
          ) : (
            featuredAlumni.map(al => (
              <AlumniCard key={al.id} alumnus={al} onSelectProfile={onSelectProfile} />
            ))
          )}
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

