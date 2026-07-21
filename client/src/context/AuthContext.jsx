import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_PROFILES = {
  guest: {
    role: 'guest',
    name: 'Visitor Account',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
  },
  student: {
    role: 'student',
    name: 'Saurav Sharma',
    registerNumber: 'CS2023054',
    email: 'saurav.sharma@gmail.com',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'
  },
  alumni: {
    role: 'alumni',
    id: 'a10',
    name: 'Vikram Malhotra',
    batch: 2012,
    company: 'Zoho',
    designation: 'Engineering Head (SaaS Platforms)',
    email: 'vikram.malhotra@zoho.com',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100'
  },
  faculty: {
    role: 'faculty',
    name: 'Dr. K. Raghavan',
    designation: 'Faculty Coordinator & Head of Dept',
    email: 'cs.coordinator@college.edu',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cs_alumni_user');
    return saved ? JSON.parse(saved) : MOCK_PROFILES.guest;
  });

  const loginAs = (role) => {
    const profile = MOCK_PROFILES[role] || MOCK_PROFILES.guest;
    setCurrentUser(profile);
    localStorage.setItem('cs_alumni_user', JSON.stringify(profile));
  };

  const logout = () => {
    loginAs('guest');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
