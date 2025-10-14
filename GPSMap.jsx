import React, { useState, useEffect } from 'react';
import { counties } from '../data/counties';
import { MapPin, Navigation, Satellite, Droplets, TreePine, AlertTriangle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GPSMap = ({ selectedRegion }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapType, setMapType] = useState('satellite');

  const county = counties.find(c => c.id === selectedRegion);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getMapUrl = (lat, lon, zoom = 12) => {
    // Using OpenStreetMap tile server for satellite-like view
    // In production, you would use Google Maps API, Mapbox, or similar
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;
  };

  const displayLat = userLocation?.lat || county?.coords.lat || -1.2921;
  const displayLon = userLocation?.lon || county?.coords.lon || 36.8219;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Satellite className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">Live GPS Tracking</h3>
              <p className="text-sm text-blue-100">
                {county ? county.name : 'Select a county'}
              </p>
            </div>
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            size="sm"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span className="ml-2">Update Location</span>
          </Button>
        </div>
      </div>

      {/* Location Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Latitude</span>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {displayLat.toFixed(6)}°
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Longitude</span>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {displayLon.toFixed(6)}°
          </p>
        </div>

        {county && (
          <>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-medium text-gray-600">Water Stress</span>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {county.waterStress}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TreePine className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600">NDVI</span>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {county.ndvi}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Map View */}
      <div className="relative">
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {/* Simulated Satellite Map */}
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={getMapUrl(displayLat, displayLon)}
            className="w-full h-full"
          />
          
          {/* Overlay with location info */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">
                  {userLocation ? 'Your Current Location' : 'County Center'}
                </p>
                <p className="text-sm text-gray-600">
                  {county?.name || 'Unknown Location'}
                </p>
                {userLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Accuracy: ±{Math.round(userLocation.accuracy)}m
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Map Type Toggle */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-1 flex gap-1">
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mapType === 'satellite'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Satellite className="w-4 h-4 inline mr-1" />
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Environmental Metrics for Current Location */}
      {county && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
          <h4 className="font-semibold text-gray-800 mb-3">Environmental Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Land Degradation</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${county.degradation}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-800">{county.degradation}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Rainfall (Annual)</p>
              <p className="text-lg font-bold text-blue-600">{county.rainfall}mm</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Carbon Potential</p>
              <p className="text-lg font-bold text-green-600">
                {(county.carbonPotential / 1000).toFixed(1)}k tCO₂
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Soil Type</p>
              <p className="text-sm font-semibold text-gray-800">{county.soilType}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSMap;

