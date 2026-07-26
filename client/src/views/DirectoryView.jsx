import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { AlumniCard } from '../components/AlumniCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorBanner } from '../components/ErrorBanner';
import { useDebounce } from '../hooks/useDebounce';

export const DirectoryView = ({ onSelectProfile, searchQuery, setSearchQuery, onApplyOpportunity }) => {
  const [alumni, setAlumni] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [showOpportunities, setShowOpportunities] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [batchFilter, setBatchFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const scrollRef = useRef(null);

  // Debounce the search query to prevent API hammering on every keystroke
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchAlumni();
  }, [debouncedSearch, batchFilter, companyFilter, locationFilter, roleFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (debouncedSearch) filters.search = debouncedSearch;
      if (batchFilter) filters.batch = batchFilter;
      if (companyFilter) filters.company = companyFilter;
      if (locationFilter) filters.location = locationFilter;
      if (roleFilter) filters.role = roleFilter;

      const res = await api.getAlumni(filters);
      if (res.success) setAlumni(res.data);
    } catch (e) {
      console.error(e);
      setError('Failed to load alumni directory.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await api.getOpportunities();
      if (res.success) setOpportunities(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setBatchFilter('');
    setCompanyFilter('');
    setLocationFilter('');
    setRoleFilter('');
  };

  const scrollNetflix = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Alumni Registry</h1>
          <p className="text-xs text-slate-400 mt-1">Search and filter B.Sc Computer Science graduates from 1994 to present.</p>
        </div>

        <button
          onClick={() => setShowOpportunities(!showOpportunities)}
          className="btn btn-primary text-xs font-bold self-start md:self-auto flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{showOpportunities ? 'Hide Opportunities' : 'Show Student Opportunities'}</span>
        </button>
      </div>

      {/* Opportunities Horizontal Row */}
      {showOpportunities && opportunities.length > 0 && (
        <div className="bg-slate-950/60 border border-violet-500/20 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Opportunities for Students
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollNetflix(-320)}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-violet-500"
                aria-label="Scroll opportunities left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollNetflix(320)}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-violet-500"
                aria-label="Scroll opportunities right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="netflix-scroll-wrapper">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opp={opp} onApply={onApplyOpportunity} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Batch</label>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="">All Batches</option>
            {Array.from({ length: 2026 - 1994 + 1 }, (_, i) => 2026 - i).map(y => (
              <option key={y} value={y}>Batch of {y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="">All Companies</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Amazon">Amazon</option>
            <option value="Zoho">Zoho</option>
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Cognizant">Cognizant</option>
            <option value="Accenture">Accenture</option>
            <option value="Oracle">Oracle</option>
            <option value="IBM">IBM</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="international">International (US/EU)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role Type</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="">All Roles</option>
            <option value="architect">Architects</option>
            <option value="vp-director">VP & Directors</option>
            <option value="sde">Developers & SRE</option>
            <option value="product">Product & UX</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="btn btn-secondary w-full text-xs font-semibold py-2 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Alumni Grid */}
      {error ? (
        <ErrorBanner message={error} onRetry={fetchAlumni} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center py-16 glass-panel space-y-3">
          <p className="text-base font-bold text-white">No Alumni Matched Your Filters</p>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or resetting filters.</p>
          <button onClick={handleReset} className="btn btn-primary text-xs font-bold">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alumni.map(al => (
            <AlumniCard key={al.id} alumnus={al} onSelectProfile={onSelectProfile} />
          ))}
        </div>
      )}
    </div>
  );
};
