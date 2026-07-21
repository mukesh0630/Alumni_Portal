import React, { useState } from 'react';
import { GraduationCap, Send, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const StudentGraduationView = () => {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    batch: '2026',
    company: '',
    designation: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    skills: '',
    achievements: '',
    bio: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.registerAlumni(formData);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in text-center glass-panel space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Registration Application Submitted</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
          Your registry application has been sent to the Department Faculty Coordinator (Dr. K. Raghavan). Once verified, your profile will be promoted to the active Alumni Registry.
        </p>
        <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-800/40 text-xs text-violet-300 max-w-md mx-auto">
          💡 <strong>Tip for Demo Presentation:</strong> You can switch role to <strong>Faculty Coordinator</strong> in top profile menu to approve your application instantly!
        </div>
        <button onClick={() => setSubmitted(false)} className="btn btn-secondary text-xs font-bold mt-2">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl font-extrabold text-white">Request Alumni Status</h1>
        </div>
        <p className="text-xs text-slate-400">Are you graduating? Fill in your placement details below to request transition from Student to Alumni status.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel space-y-5">
        <h3 className="text-sm font-bold text-violet-400 pb-2 border-b border-slate-800">
          B.Sc CS Graduate Placement Form
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Saurav Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Register Number</label>
            <input
              type="text"
              required
              value={formData.registerNumber}
              onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
              placeholder="e.g. CS2023054"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Batch</label>
            <input
              type="number"
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              min="1994"
              max="2027"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Placement / Company</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Google / Zoho"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Job Role</label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Associate Software Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bengaluru, India"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="saurav.sharma@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 95555 67890"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma-separated)</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, Node.js, JavaScript, Python"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio</label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Outgoing B.Sc CS student excited to start software engineering role..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary text-xs font-bold w-full py-2.5 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Submit Application to Faculty Panel
        </button>
      </form>
    </div>
  );
};
