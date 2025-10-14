import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { counties } from '../data/counties';
import { Camera, MapPin, Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageUpload = ({ selectedRegion, onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user, isGuest } = useAuth();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const removeFile = (id) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    if (isGuest) {
      alert('Please sign in to upload images');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (!location.trim()) {
      alert('Please specify the location');
      return;
    }

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const county = counties.find(c => c.id === selectedRegion);
      const uploads = selectedFiles.map(fileObj => ({
        id: Date.now() + Math.random(),
        userId: user.id,
        userName: user.name,
        countyId: selectedRegion,
        countyName: county?.name || 'Unknown',
        location: location,
        comment: comment,
        timestamp: new Date().toISOString(),
        verified: true,
        likes: 0,
        preview: fileObj.preview
      }));

      // Store in localStorage
      const existingUploads = JSON.parse(localStorage.getItem('regenUploads') || '[]');
      localStorage.setItem('regenUploads', JSON.stringify([...existingUploads, ...uploads]));

      setUploading(false);
      setIsOpen(false);
      setSelectedFiles([]);
      setLocation('');
      setComment('');

      if (onUploadSuccess) {
        onUploadSuccess(uploads);
      }
    }, 1500);
  };

  const county = counties.find(c => c.id === selectedRegion);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
      >
        <Camera className="w-5 h-5" />
        Upload Image
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Upload Images</h3>
                <p className="text-gray-600 mt-1">
                  {county ? `Uploading to ${county.name}` : 'Select a county first'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {isGuest && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  You're browsing as a guest. Please sign in to upload images and contribute to the community.
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={isGuest}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                </label>
              </div>
            </div>

            {/* Preview Selected Images */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({selectedFiles.length})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="relative group">
                      <img
                        src={fileObj.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Juja, Kayole, Kibera"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isGuest}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Specify the exact location within {county?.name || 'the county'}
              </p>
            </div>

            {/* Comment Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any observations about the environmental conditions..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={isGuest}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isGuest || uploading || selectedFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;

