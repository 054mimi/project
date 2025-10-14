import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { counties } from '../data/counties';
import { Phone, Mail, MapPin, Shield, AlertCircle } from 'lucide-react';

const ContactInfo = () => {
  const { user, isGuest } = useAuth();
  const { getSubAdminByCounty } = useAdminAuth();
  const [countyAdmin, setCountyAdmin] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);

  useEffect(() => {
    if (user?.region) {
      loadCountyAdmin(user.region);
      setSelectedCounty(user.region);
    }
  }, [user]);

  const loadCountyAdmin = (countyId) => {
    const admin = getSubAdminByCounty(countyId);
    setCountyAdmin(admin);
  };

  const handleCountyChange = (countyId) => {
    setSelectedCounty(parseInt(countyId));
    loadCountyAdmin(parseInt(countyId));
  };

  const county = counties.find(c => c.id === selectedCounty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Phone className="w-7 h-7" />
          Contact Information
        </h2>
        <p className="text-blue-100 mt-1">
          Reach out to your county administrator for environmental concerns
        </p>
      </div>

      {/* County Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select County
        </label>
        <select
          value={selectedCounty || ''}
          onChange={(e) => handleCountyChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a county...</option>
          {counties.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contact Details */}
      {county && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">{county.name}</h3>
          </div>

          {countyAdmin ? (
            <div className="space-y-6">
              {/* Admin Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">County Administrator</h4>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-2">{countyAdmin.name}</p>
                <p className="text-sm text-gray-600">Environmental Officer - {county.name}</p>
              </div>

              {/* Contact Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-700">Email</span>
                  </div>
                  <a
                    href={`mailto:${countyAdmin.contactEmail}`}
                    className="text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    {countyAdmin.contactEmail}
                  </a>
                </div>

                {/* Phone */}
                <div className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-700">Phone</span>
                  </div>
                  {countyAdmin.contactPhone ? (
                    <a
                      href={`tel:${countyAdmin.contactPhone}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {countyAdmin.contactPhone}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">Not available yet</p>
                  )}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Office Hours</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* What to Report */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">What You Can Report</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Environmental degradation concerns</li>
                  <li>• Water stress and drought conditions</li>
                  <li>• Illegal logging or deforestation</li>
                  <li>• Pollution and waste management issues</li>
                  <li>• Community reforestation initiatives</li>
                  <li>• Wildlife and ecosystem concerns</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">No Administrator Assigned</h4>
                <p className="text-sm text-yellow-700">
                  A county administrator has not been assigned to {county.name} yet. 
                  Please check back later or contact the chief administrator at:
                </p>
                <p className="text-sm font-medium text-yellow-800 mt-2">
                  chief.raydun@gmail.com
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chief Admin Contact (Always Visible) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Chief Administrator</h3>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            For system-wide issues or urgent matters
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <a
                href="mailto:chief.raydun@gmail.com"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                chief.raydun@gmail.com
              </a>
            </div>
            <p className="text-sm text-gray-600">
              Oversees all 47 counties and coordinates environmental initiatives across Kenya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

