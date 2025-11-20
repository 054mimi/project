import React, { useState, useEffect } from 'react';
import { counties } from './counties';
import { MapPin, User, Calendar, MessageSquare, Heart, CheckCircle, Image as ImageIcon } from 'lucide-react';
const API_BASE = 'http://localhost:5000/api';

const ImageGallery = ({ selectedRegion }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, [selectedRegion]);

  const loadImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/images/county/${selectedRegion}`);
      if (response.ok) {
        const regionImages = await response.json();
        setImages(regionImages);
      }
    } catch (err) {
      console.error('Failed to load images');
    }
  };

  const handleLike = async (imageId) => {
    const user = JSON.parse(localStorage.getItem('regenUser'));
    if (!user) return;

    try {
      const token = localStorage.getItem('regenToken');
      const response = await fetch(`${API_BASE}/images/${imageId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setImages(images.map(img => img._id === imageId ? updatedImage : img));
        if (selectedImage && selectedImage._id === imageId) {
          setSelectedImage(updatedImage);
        }
      }
    } catch (err) {
      console.error('Failed to like image');
    }
  };

  const hasUserLiked = (image) => {
    const user = JSON.parse(localStorage.getItem('regenUser'));
    return user && image.likedBy && image.likedBy.includes(user.id);
  };

  const county = counties.find(c => c.id === selectedRegion);

  if (!county) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Please select a county to view images</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Community Images</h3>
          <p className="text-gray-600 mt-1">
            {county.name} - {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No images uploaded yet for {county.name}</p>
          <p className="text-sm text-gray-400">Be the first to contribute!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`http://localhost:5000${image.imageUrl}`}
                  alt={image.location}
                  className="w-full h-full object-cover"
                />
                {image.verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">{image.location}</p>
                    <p className="text-sm text-gray-500">{image.countyName}</p>
                  </div>
                </div>

                {image.comment && (
                  <div className="flex items-start gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 line-clamp-2">{image.comment}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{image.userName}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(image._id);
                    }}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      hasUserLiked(image)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasUserLiked(image) ? 'fill-current' : ''}`} />
                    <span>{image.likes || 0}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(image.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={`http://localhost:5000${selectedImage.imageUrl}`}
                alt={selectedImage.location}
                className="w-full h-auto max-h-[60vh] object-contain bg-gray-100"
              />
              {selectedImage.verified && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified by LandGuard AI
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedImage.location}</h4>
                  <p className="text-gray-600">{selectedImage.countyName}</p>
                </div>
              </div>

              {selectedImage.comment && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{selectedImage.comment}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{selectedImage.userName}</span>
                  <span className="text-gray-400">•</span>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(selectedImage.timestamp).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleLike(selectedImage._id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasUserLiked(selectedImage)
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasUserLiked(selectedImage) ? 'fill-current' : ''}`} />
                  <span className="font-semibold">
                    {hasUserLiked(selectedImage) ? 'Unlike' : 'Like'} ({selectedImage.likes || 0})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

