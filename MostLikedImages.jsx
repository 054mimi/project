import React, { useState, useEffect } from 'react';
import { counties } from '../data/counties';
import { Heart, Trophy, MapPin, User, Calendar } from 'lucide-react';

const MostLikedImages = () => {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [mostLiked, setMostLiked] = useState([]);

  useEffect(() => {
    if (selectedCounty) {
      loadMostLikedImages(selectedCounty);
    }
  }, [selectedCounty]);

  const loadMostLikedImages = (countyId) => {
    const allUploads = JSON.parse(localStorage.getItem('regenUploads') || '[]');
    const countyImages = allUploads.filter(img => img.countyId === countyId);
    
    // Sort by likes and get top 10
    const sorted = countyImages
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 10);
    
    setMostLiked(sorted);
  };

  const county = counties.find(c => c.id === selectedCounty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Trophy className="w-7 h-7" />
          Most Liked Images
        </h2>
        <p className="text-yellow-100 mt-1">
          Top 10 community-favorite images from each county
        </p>
      </div>

      {/* County Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select County
        </label>
        <select
          value={selectedCounty || ''}
          onChange={(e) => setSelectedCounty(parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="">Choose a county...</option>
          {counties.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Most Liked Images Grid */}
      {county && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-yellow-600" />
              {county.name}
            </h3>
            <span className="text-sm text-gray-600">
              {mostLiked.length} {mostLiked.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          {mostLiked.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No images with likes yet</p>
              <p className="text-sm text-gray-400">Be the first to upload and get likes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostLiked.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 relative"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Trophy for Top 3 */}
                  {index < 3 && (
                    <div className="absolute top-3 right-3 z-10">
                      <Trophy className={`w-6 h-6 ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-400' :
                        'text-orange-400'
                      } drop-shadow-lg`} />
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={image.preview}
                      alt={image.location}
                      className="w-full h-full object-cover"
                    />
                    {/* Likes Overlay */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-current text-red-500" />
                      <span className="font-bold">{image.likes || 0}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">{image.location}</p>
                        <p className="text-sm text-gray-500">{image.countyName}</p>
                      </div>
                    </div>

                    {image.comment && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {image.comment}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span className="truncate">{image.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Daily Reset Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Rankings are updated in real-time based on community likes. 
          The most engaging environmental documentation rises to the top!
        </p>
      </div>
    </div>
  );
};

export default MostLikedImages;

