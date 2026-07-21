import React, { useState } from 'react';
import { UserCog, Save, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AlumniDashboardView = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser.name || 'Vikram Malhotra',
    designation: currentUser.designation || 'Engineering Head (SaaS Platforms)',
    company: currentUser.company || 'Zoho',
    location: currentUser.location || 'Chennai, India',
    bio: currentUser.bio || 'Built core components of Zoho Desk and Zoho Mail server infrastructure.',
    skills: currentUser.skills ? currentUser.skills.join(', ') : 'Java, SaaS Engineering, Database Tuning',
    mentorship: currentUser.mentorship !== undefined ? currentUser.mentorship : true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: formData.name,
      designation: formData.designation,
      company: formData.company,
      location: formData.location,
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()),
      mentorship: formData.mentorship
    };
    setCurrentUser(updated);
    localStorage.setItem('cs_alumni_user', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <UserCog className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-extrabold text-white">My Alumni Profile Dashboard</h1>
        </div>
        <p className="text-xs text-slate-400">Update your employment milestones, skills, bio summary, and mentorship status flag.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Profile Information</h3>
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Company</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Designation</label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Bio & Experience Overview</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma-separated)</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <div className="font-bold text-white text-xs">Mentorship Program Availability</div>
              <div className="text-[11px] text-slate-400">Show 'Mentorship Available' badge on your alumni card for students.</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.mentorship}
            onChange={(e) => setFormData({ ...formData, mentorship: e.target.checked })}
            className="w-5 h-5 accent-violet-600 rounded cursor-pointer"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="btn btn-primary text-xs font-bold px-6 py-2.5 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
