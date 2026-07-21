import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const ContactView = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendContactForm(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Contact Department</h1>
        <p className="text-xs text-slate-400 mt-1">Get in touch with our Faculty Coordinator for registry verification or legacy additions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="glass-panel space-y-6">
          <h3 className="text-lg font-bold text-violet-400">Department Directory</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Dr. K. Raghavan</div>
                <div className="text-slate-400">Faculty Coordinator & Head of Department</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">cs.coordinator@college.edu</div>
                <div className="text-slate-400">Official Department Mail</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">+91 44 2745 4210</div>
                <div className="text-slate-400">Coordinator Office Extension</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Computer Science Block, First Floor</div>
                <div className="text-slate-400">College Main Road Campus, PIN 600045</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel">
          <h3 className="text-lg font-bold text-violet-400 mb-4">Send a Message</h3>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Message Delivered!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Thank you for reaching out. Your message has been routed to Dr. K. Raghavan (Faculty Coordinator).
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary text-xs">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. name@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your query, request verification, or leave portal suggestions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary text-xs font-bold w-full py-2.5 flex items-center justify-center gap-1.5">
                <Send className="w-4 h-4" /> Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
