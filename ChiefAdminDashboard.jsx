import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { counties } from '@/data/counties';
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Image as ImageIcon,
  TrendingUp,
  Search,
  Trash2,
  Copy,
  Check,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Globe,
  Clock,
  Shield
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

const ChiefAdminDashboard = () => {
  const { admin, getSubAdmins, createSubAdmin, deleteSubAdmin, getAdminUrl } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [showCreateSubAdmin, setShowCreateSubAdmin] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({ name: '', email: '', countyId: '' });
  const [siteVisits, setSiteVisits] = useState([]);
  const [imageUploads, setImageUploads] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load users
    const allUsers = JSON.parse(localStorage.getItem('regenUsers') || '[]');
    setUsers(allUsers.map(u => ({
      ...u,
      membershipDuration: calculateMembershipDuration(u.createdAt)
    })));

    // Load guests (simulated with IP/MAC)
    const guestSessions = JSON.parse(localStorage.getItem('regenGuestSessions') || '[]');
    setGuests(guestSessions);

    // Load sub-admins
    setSubAdmins(getSubAdmins());

    // Load site visits (simulated data)
    const visits = generateSiteVisits();
    setSiteVisits(visits);

    // Load image uploads
    const uploads = JSON.parse(localStorage.getItem('regenUploads') || '[]');
    setImageUploads(uploads);
  };

  const calculateMembershipDuration = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const generateSiteVisits = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visits: Math.floor(Math.random() * 500) + 200,
        uniqueVisitors: Math.floor(Math.random() * 300) + 100
      });
    }
    return last7Days;
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user account?')) {
      const allUsers = JSON.parse(localStorage.getItem('regenUsers') || '[]');
      const filtered = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('regenUsers', JSON.stringify(filtered));
      loadData();
    }
  };

  const handleCreateSubAdmin = () => {
    if (!newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.countyId) {
      alert('Please fill in all fields');
      return;
    }

    const county = counties.find(c => c.id === parseInt(newSubAdmin.countyId));
    const result = createSubAdmin({
      name: newSubAdmin.name,
      email: newSubAdmin.email,
      countyId: parseInt(newSubAdmin.countyId),
      countyName: county.name,
      password: `SubAdmin@${county.name}2025` // Auto-generated password
    });

    if (result.success) {
      alert(`Sub-admin created successfully!\nPassword: SubAdmin@${county.name}2025`);
      setShowCreateSubAdmin(false);
      setNewSubAdmin({ name: '', email: '', countyId: '' });
      loadData();
    } else {
      alert(result.error);
    }
  };

  const handleDeleteSubAdmin = (adminId) => {
    if (confirm('Are you sure you want to remove this sub-admin?')) {
      deleteSubAdmin(adminId);
      loadData();
    }
  };

  const handleCopyUrl = (adminId) => {
    const url = getAdminUrl(adminId);
    navigator.clipboard.writeText(url);
    setCopiedUrl(adminId);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalGuests: guests.length,
    totalSubAdmins: subAdmins.length,
    totalImages: imageUploads.length,
    todayVisits: siteVisits[siteVisits.length - 1]?.visits || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Chief Admin Dashboard
              </h1>
              <p className="text-indigo-100 mt-1">Welcome back, {admin?.name}</p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm opacity-90">Role: Chief Administrator</p>
              <p className="text-xs opacity-75">Full System Access</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-indigo-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Registered Users', icon: Users },
                { id: 'guests', label: 'Guest Sessions', icon: UserCheck },
                { id: 'subadmins', label: 'Sub-Admins', icon: Shield },
                { id: 'images', label: 'Image Uploads', icon: ImageIcon },
                { id: 'analytics', label: 'Site Analytics', icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-white'
                        : 'text-indigo-100 hover:text-white hover:bg-indigo-600/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Registered Users</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalGuests}</p>
                <p className="text-sm text-gray-600">Guest Sessions</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSubAdmins}/47</p>
                <p className="text-sm text-gray-600">Sub-Admins</p>
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
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.todayVisits}</p>
                <p className="text-sm text-gray-600">Today's Visits</p>
              </div>
            </div>

            {/* Site Visits Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Site Traffic (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={siteVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} name="Total Visits" />
                  <Line type="monotone" dataKey="uniqueVisitors" stroke="#3b82f6" strokeWidth={2} name="Unique Visitors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Registered Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Registered Users ({users.length})</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">County</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member Since</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const county = counties.find(c => c.id === user.region);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{county?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.membershipDuration}</td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Guest Sessions Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Guest Sessions ({guests.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Session ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">IP Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">MAC Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Active</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pages Viewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No guest sessions recorded yet
                      </td>
                    </tr>
                  ) : (
                    guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-800">{guest.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{guest.ip}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{guest.mac}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{guest.lastActive}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{guest.pagesViewed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sub-Admins Tab */}
        {activeTab === 'subadmins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Sub-Administrators ({subAdmins.length}/47)</h3>
                <Button
                  onClick={() => setShowCreateSubAdmin(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Sub-Admin
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subAdmins.map((subAdmin) => (
                  <div key={subAdmin.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{subAdmin.name}</h4>
                        <p className="text-sm text-gray-600">{subAdmin.countyName}</p>
                      </div>
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>{subAdmin.email}</p>
                      <p className="text-xs">Created: {new Date(subAdmin.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopyUrl(subAdmin.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        {copiedUrl === subAdmin.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy URL
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDeleteSubAdmin(subAdmin.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Sub-Admin Modal */}
            {showCreateSubAdmin && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Create Sub-Admin</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newSubAdmin.name}
                        onChange={(e) => setNewSubAdmin({ ...newSubAdmin, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter admin name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={newSubAdmin.email}
                        onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="county.raydun@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                      <select
                        value={newSubAdmin.countyId}
                        onChange={(e) => setNewSubAdmin({ ...newSubAdmin, countyId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select County</option>
                        {counties.map((county) => (
                          <option key={county.id} value={county.id}>
                            {county.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setShowCreateSubAdmin(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateSubAdmin}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Uploads Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">All Image Uploads ({imageUploads.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageUploads.map((upload) => (
                <div key={upload.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img src={upload.preview} alt={upload.location} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-800">{upload.location}</p>
                    <p className="text-xs text-gray-600">{upload.countyName}</p>
                    <p className="text-xs text-gray-500 mt-1">By: {upload.userName}</p>
                    <p className="text-xs text-gray-400">{new Date(upload.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChiefAdminDashboard;

