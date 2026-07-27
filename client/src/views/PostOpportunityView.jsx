import React, { useState } from 'react';
import { PlusCircle, Send, Save, Briefcase, MapPin, Clock, DollarSign, Users, Link2, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PostOpportunityView = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    company: currentUser.company || '',
    location: '',
    employmentType: 'Full-time',
    salary: '',
    experience: '',
    skills: '',
    description: '',
    applicationLink: '',
    contactEmail: currentUser.email || '',
    lastDate: '',
    vacancies: '1'
  });

  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.postOpportunity({
        ...formData,
        postedBy: currentUser.name,
        postedById: currentUser.id,
        status: 'pending'
      });
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await api.saveDraftOpportunity({
        ...formData,
        postedBy: currentUser.name,
        postedById: currentUser.id,
        status: 'draft'
      });
      setSavedDraft(true);
      setTimeout(() => setSavedDraft(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in text-center glass-panel space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Opportunity Submitted for Approval</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
          Your job opportunity posting for <strong className="text-white">{formData.title}</strong> at <strong className="text-white">{formData.company}</strong> has been submitted to the Faculty Coordinator for review.
        </p>
        <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-800/40 text-xs text-violet-300 max-w-md mx-auto">
          💡 Once approved by Faculty, it will be visible in the Student Opportunities section.
        </div>
        <button onClick={() => { setSubmitted(false); setFormData({ ...formData, title: '', description: '', skills: '', salary: '', experience: '', applicationLink: '', lastDate: '', vacancies: '1' }); }} className="btn btn-secondary text-xs font-bold mt-2">
          Post Another Opportunity
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PlusCircle className="w-6 h-6 text-violet-400" />
          <h1 className="text-3xl font-extrabold text-white">Post a New Opportunity</h1>
        </div>
        <p className="text-xs text-slate-400">Share job openings, internships, or referral opportunities for current students. All postings require Faculty Coordinator approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Opportunity Details</h3>
          {savedDraft && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Draft saved!
            </span>
          )}
        </div>

        {/* Row 1: Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Briefcase className="w-3.5 h-3.5 inline mr-1 text-violet-400" />Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Associate Software Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Briefcase className="w-3.5 h-3.5 inline mr-1 text-violet-400" />Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g. Zoho Corp"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Row 2: Location & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-pink-400" />Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Chennai, India / Remote"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type *</label>
            <select
              required
              value={formData.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Row 3: Salary & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <DollarSign className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />Salary Range (optional)
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              placeholder="e.g. ₹6-8 LPA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Required</label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="e.g. 0-2 years / Freshers"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Users className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />Vacancies
            </label>
            <input
              type="number"
              min="1"
              value={formData.vacancies}
              onChange={(e) => handleChange('vacancies', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (comma-separated) *</label>
          <input
            type="text"
            required
            value={formData.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            placeholder="e.g. React, Node.js, Python, SQL"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description *</label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the role, responsibilities, team, and growth opportunities..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Row: Application Link, Contact Email, Last Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Link2 className="w-3.5 h-3.5 inline mr-1 text-violet-400" />Application Link
            </label>
            <input
              type="url"
              value={formData.applicationLink}
              onChange={(e) => handleChange('applicationLink', e.target.value)}
              placeholder="https://careers.company.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Mail className="w-3.5 h-3.5 inline mr-1 text-pink-400" />Contact Email *
            </label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" />Last Date to Apply
            </label>
            <input
              type="date"
              value={formData.lastDate}
              onChange={(e) => handleChange('lastDate', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn btn-secondary text-xs font-bold px-5 py-2.5 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-xs font-bold px-6 py-2.5 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};
