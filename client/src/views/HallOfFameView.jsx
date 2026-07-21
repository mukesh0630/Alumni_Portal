import React, { useState, useEffect } from 'react';
import { Award, Briefcase, MapPin, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export const HallOfFameView = ({ onSelectProfile }) => {
  const [distinguished, setDistinguished] = useState([]);

  useEffect(() => {
    fetchHallOfFame();
  }, []);

  const fetchHallOfFame = async () => {
    try {
      const res = await api.getAlumni({ distinguished: 'true' });
      if (res.success) setDistinguished(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-400" /> Department Excellence
        </div>
        <h1 className="text-4xl font-extrabold text-white">Department Hall of Fame</h1>
        <p className="text-xs text-slate-400">
          Celebrating B.Sc Computer Science graduates who have achieved exceptional career summits and global engineering leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {distinguished.map((al, idx) => (
          <div
            key={al.id}
            className="glass-panel relative flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-950/20 transition-all group p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <img
                  src={al.photo}
                  alt={al.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] shadow-md">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {al.name}
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">
                  {al.designation} at <strong className="text-white">{al.company}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Batch of {al.batch} • {al.location}</p>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 mb-4">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                Core Distinction
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {al.achievements[0]}
              </p>
            </div>

            <button
              onClick={() => onSelectProfile(al.id)}
              className="btn btn-secondary text-xs font-bold w-full flex items-center justify-center gap-1 group-hover:border-amber-500/40"
            >
              <span>View Full Legacy Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
