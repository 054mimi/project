import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { counties } from '../data/counties';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RegionSelector = ({ selectedRegion, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, switchRegion } = useAuth();

  const filteredCounties = counties.filter(county =>
    county.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionSelect = (countyId) => {
    onRegionChange(countyId);
    if (user) {
      switchRegion(countyId);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentCounty = counties.find(c => c.id === selectedRegion);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
        variant="outline"
      >
        <MapPin className="w-5 h-5 text-green-600" />
        <span className="font-semibold">
          {currentCounty ? currentCounty.name : 'Select County'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search counties..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Counties List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCounties.length > 0 ? (
                filteredCounties.map((county) => (
                  <button
                    key={county.id}
                    onClick={() => handleRegionSelect(county.id)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-green-50 transition-colors ${
                      selectedRegion === county.id ? 'bg-green-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">{county.name}</div>
                        <div className="text-xs text-gray-500">
                          Water Stress: {county.waterStress}% | NDVI: {county.ndvi}
                        </div>
                      </div>
                    </div>
                    {selectedRegion === county.id && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No counties found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
              {filteredCounties.length} of {counties.length} counties
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegionSelector;

