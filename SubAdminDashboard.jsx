import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { counties } from '../data/counties';
import {
  Users,
  Image as ImageIcon,
  Activity,
  MapPin,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SubAdminDashboard = () => {
  const { admin, updateSubAdmin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [imageUploads, setImageUploads] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [contactPhone, setContactPhone] = useState('');
  const [editingContact, setEditingContact] = useState(false);

  const county = counties.find(c => c.id === admin?.countyId);

  useEffect(() => {
    if (admin) {
      loadCountyData();
      setContactPhone(admin.contactPhone || '');
    }
  }, [admin]);

  const loadCountyData = () => {
    // Load users from this county
    const allUsers = JSON.parse(localStorage.getItem('regenUsers') || '[]');
    const countyUsers = allUsers.filter(u => u.region === admin.countyId);
    setUsers(countyUsers);

    // Load image uploads from this county
    const allUploads = JSON.parse(localStorage.getItem('regenUploads') || '[]');
    const countyUploads = allUploads.filter(u => u.countyId === admin.countyId);
    setImageUploads(countyUploads);

    // Load tickets for this county
    const allTickets = JSON.parse(localStorage.getItem('regenTickets') || '[]');
    const countyTickets = allTickets.filter(t => t.countyId === admin.countyId);
    setTickets(countyTickets);
  };

  const handleUpdateContact = () => {
    updateSubAdmin(admin.id, { contactPhone });
    setEditingContact(false);
    alert('Contact information updated successfully');
  };

  const stats = {
    totalUsers: users.length,
    totalImages: imageUploads.length,
    pendingTickets: tickets.filter(t => t.status === 'pending').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length
  };

  // Generate activity data for the county
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    uploads: Math.floor(Math.random() * 20) + 5,
    users: Math.floor(Math.random() * 15) + 3
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                {county?.name} Admin Dashboard
              </h1>
              <p className="text-green-100 mt-1">Sub-Administrator: {admin?.name}</p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm opacity-90">County: {county?.name}</p>
              <p className="text-xs opacity-75">{admin?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">County Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <ImageIcon className="w-8 h-8 text-pink-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalImages}</p>
            <p className="text-sm text-gray-600">Image Uploads</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pendingTickets}</p>
            <p className="text-sm text-gray-600">Pending Tickets</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.resolvedTickets}</p>
            <p className="text-sm text-gray-600">Resolved Tickets</p>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uploads" fill="#10b981" name="Image Uploads" />
              <Bar dataKey="users" fill="#3b82f6" name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              Contact Information
            </h3>
            {!editingContact && (
              <Button
                onClick={() => setEditingContact(true)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                County Email
              </label>
              <input
                type="email"
                value={admin?.contactEmail || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              {editingContact ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+254 XXX XXX XXX"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleUpdateContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingContact(false);
                      setContactPhone(admin.contactPhone || '');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <input
                  type="tel"
                  value={contactPhone || 'Not set'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> This contact information will be displayed to citizens from {county?.name} 
              who need to reach you for environmental concerns.
            </p>
          </div>
        </div>

        {/* Recent Image Uploads */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Image Uploads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUploads.slice(0, 8).map((upload) => (
              <div key={upload.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img src={upload.preview} alt={upload.location} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="font-semibold text-sm text-gray-800">{upload.location}</p>
                  <p className="text-xs text-gray-600">By: {upload.userName}</p>
                  <p className="text-xs text-gray-400">{new Date(upload.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* County Users */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Registered Users from {county?.name}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Uploads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const userUploads = imageUploads.filter(u => u.userId === user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{userUploads.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubAdminDashboard;

