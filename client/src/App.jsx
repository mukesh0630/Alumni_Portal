import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AlumniModal } from './components/AlumniModal';
import { MentorshipModal } from './components/MentorshipModal';
import { api } from './services/api';

import { DashboardView } from './views/DashboardView';
import { DirectoryView } from './views/DirectoryView';
import { HallOfFameView } from './views/HallOfFameView';
import { StatsView } from './views/StatsView';
import { AiAssistantView } from './views/AiAssistantView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FacultyDashboardView } from './views/FacultyDashboardView';
import { AlumniDashboardView } from './views/AlumniDashboardView';
import { StudentGraduationView } from './views/StudentGraduationView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [mentorshipAlumnus, setMentorshipAlumnus] = useState(null);

  // AI assistant direct query trigger
  const [aiTargetName, setAiTargetName] = useState(null);
  const [aiPromptType, setAiPromptType] = useState(null);

  const handleSelectProfile = async (id) => {
    try {
      const res = await api.getAlumnusById(id);
      if (res.success) {
        setSelectedAlumnus(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiQueryFromModal = (promptType, targetName) => {
    setSelectedAlumnus(null);
    setAiPromptType(promptType);
    setAiTargetName(targetName);
    setActiveView('ai-assistant');
  };

  const handleApplyOpportunity = (opp) => {
    alert(`Interest expressed for: ${opp.title} (${opp.company}). The alumnus contact will be emailed to your account!`);
  };

  return (
    <div className="flex min-h-screen bg-[#0a061e] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView setActiveView={setActiveView} onSelectProfile={handleSelectProfile} />
          )}

          {activeView === 'directory' && (
            <DirectoryView
              onSelectProfile={handleSelectProfile}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onApplyOpportunity={handleApplyOpportunity}
            />
          )}

          {activeView === 'hall-of-fame' && (
            <HallOfFameView onSelectProfile={handleSelectProfile} />
          )}

          {activeView === 'stats' && <StatsView />}

          {activeView === 'ai-assistant' && (
            <AiAssistantView initialTargetAlumni={aiTargetName} initialPromptType={aiPromptType} />
          )}

          {activeView === 'about' && <AboutView />}

          {activeView === 'contact' && <ContactView />}

          {activeView === 'faculty-dashboard' && <FacultyDashboardView />}

          {activeView === 'alumni-dashboard' && <AlumniDashboardView />}

          {activeView === 'student-graduation' && <StudentGraduationView />}

          {activeView === 'settings' && <SettingsView setActiveView={setActiveView} />}

          {activeView === 'auth' && <AuthView setActiveView={setActiveView} />}
        </main>
      </div>

      {/* Modals */}
      {selectedAlumnus && (
        <AlumniModal
          alumnus={selectedAlumnus}
          onClose={() => setSelectedAlumnus(null)}
          onRequestMentorship={(al) => {
            setSelectedAlumnus(null);
            setMentorshipAlumnus(al);
          }}
          onAiQuery={handleAiQueryFromModal}
        />
      )}

      {mentorshipAlumnus && (
        <MentorshipModal
          alumnus={mentorshipAlumnus}
          onClose={() => setMentorshipAlumnus(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
