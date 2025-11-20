import React, { createContext, useContext, useState, useEffect } from 'react';
const API_BASE = 'http://localhost:5000/api';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin session
    const token = localStorage.getItem('regenAdminToken');
    const storedAdmin = localStorage.getItem('regenAdminSession');
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setAdmin(data.admin);
        localStorage.setItem('regenAdminToken', data.token);
        localStorage.setItem('regenAdminSession', JSON.stringify(data.admin));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('regenAdminSession');
    localStorage.removeItem('regenAdminToken');
  };

  const createSubAdmin = (subAdminData) => {
    const admins = JSON.parse(localStorage.getItem('regenAdmins') || '[]');
    
    // Check if sub-admin already exists for this county
    if (admins.find(a => a.countyId === subAdminData.countyId && a.role === 'sub')) {
      return { success: false, error: 'Sub-admin already exists for this county' };
    }

    // Check if we've reached the limit of 47 sub-admins
    const subAdminCount = admins.filter(a => a.role === 'sub').length;
    if (subAdminCount >= 47) {
      return { success: false, error: 'Maximum number of sub-admins reached (47)' };
    }

    const newSubAdmin = {
      id: `sub-admin-${Date.now()}`,
      ...subAdminData,
      role: 'sub',
      createdAt: new Date().toISOString(),
      contactPhone: '',
      contactEmail: subAdminData.email
    };

    admins.push(newSubAdmin);
    localStorage.setItem('regenAdmins', JSON.stringify(admins));
    
    return { success: true, admin: newSubAdmin };
  };

  const updateSubAdmin = (adminId, updates) => {
    const admins = JSON.parse(localStorage.getItem('regenAdmins') || '[]');
    const index = admins.findIndex(a => a.id === adminId);
    
    if (index === -1) {
      return { success: false, error: 'Admin not found' };
    }

    admins[index] = { ...admins[index], ...updates };
    localStorage.setItem('regenAdmins', JSON.stringify(admins));
    
    // Update current session if it's the logged-in admin
    if (admin?.id === adminId) {
      const updatedAdmin = { ...admins[index] };
      delete updatedAdmin.password;
      setAdmin(updatedAdmin);
      localStorage.setItem('regenAdminSession', JSON.stringify(updatedAdmin));
    }
    
    return { success: true };
  };

  const deleteSubAdmin = (adminId) => {
    const admins = JSON.parse(localStorage.getItem('regenAdmins') || '[]');
    const filtered = admins.filter(a => a.id !== adminId);
    localStorage.setItem('regenAdmins', JSON.stringify(filtered));
    return { success: true };
  };

  const getSubAdmins = () => {
    const admins = JSON.parse(localStorage.getItem('regenAdmins') || '[]');
    return admins.filter(a => a.role === 'sub').map(a => {
      const { password, ...rest } = a;
      return rest;
    });
  };

  const getSubAdminByCounty = (countyId) => {
    const admins = JSON.parse(localStorage.getItem('regenAdmins') || '[]');
    const subAdmin = admins.find(a => a.countyId === countyId && a.role === 'sub');
    if (subAdmin) {
      const { password, ...rest } = subAdmin;
      return rest;
    }
    return null;
  };

  const getAdminUrl = (adminId) => {
    // Generate unique admin URL
    return `${window.location.origin}/admin/${adminId}`;
  };

  const value = {
    admin,
    loading,
    loginAdmin,
    logoutAdmin,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,
    getSubAdmins,
    getSubAdminByCounty,
    getAdminUrl,
    isChiefAdmin: admin?.role === 'chief',
    isSubAdmin: admin?.role === 'sub'
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

