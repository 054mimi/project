import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { counties } from '../data/counties';
import {
  MessageSquare,
  Send,
  Share2,
  Users,
  FileText,
  Image as ImageIcon,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminCommunication = () => {
  const { admin, getSubAdmins, isChiefAdmin } = useAdminAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [sharedContent, setSharedContent] = useState(null);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    loadMessages();
    loadAdmins();
  }, []);

  const loadMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
    // Filter messages relevant to this admin
    const relevantMessages = allMessages.filter(msg =>
      msg.recipientId === admin?.id ||
      msg.senderId === admin?.id ||
      msg.recipientId === 'all'
    );
    setMessages(relevantMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const loadAdmins = () => {
    if (isChiefAdmin) {
      // Chief admin can see all sub-admins
      setAdmins([
        { id: 'all', name: 'All Sub-Admins', countyName: 'Broadcast' },
        ...getSubAdmins()
      ]);
    } else {
      // Sub-admins can see chief admin and other sub-admins
      const allSubAdmins = getSubAdmins();
      setAdmins([
        { id: 'chief-admin', name: 'Chief Administrator', countyName: 'All Counties' },
        ...allSubAdmins.filter(a => a.id !== admin?.id)
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !sharedContent) {
      alert('Please enter a message or share content');
      return;
    }

    const message = {
      id: Date.now().toString(),
      senderId: admin.id,
      senderName: admin.name,
      senderCounty: admin.countyId ? counties.find(c => c.id === admin.countyId)?.name : 'Chief Admin',
      recipientId: selectedRecipient,
      recipientName: admins.find(a => a.id === selectedRecipient)?.name || 'Unknown',
      content: newMessage,
      sharedContent: sharedContent,
      timestamp: new Date().toISOString(),
      read: false
    };

    const allMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
    allMessages.push(message);
    localStorage.setItem('adminMessages', JSON.stringify(allMessages));

    // Create notification for recipient
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      recipientId: selectedRecipient,
      type: 'message',
      title: 'New Message',
      message: `${admin.name} sent you a message`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));

    setNewMessage('');
    setSharedContent(null);
    loadMessages();
  };

  const handleShareChart = (chartType) => {
    setSharedContent({
      type: 'chart',
      chartType,
      countyId: admin.countyId,
      countyName: admin.countyId ? counties.find(c => c.id === admin.countyId)?.name : 'All Counties'
    });
  };

  const handleShareImage = (imageId) => {
    const uploads = JSON.parse(localStorage.getItem('regenUploads') || '[]');
    const image = uploads.find(u => u.id === imageId);
    if (image) {
      setSharedContent({
        type: 'image',
        image
      });
    }
  };

  const renderSharedContent = (content) => {
    if (!content) return null;

    if (content.type === 'chart') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Shared Chart</span>
          </div>
          <p className="text-sm text-blue-700">
            {content.chartType} - {content.countyName}
          </p>
        </div>
      );
    }

    if (content.type === 'image') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Shared Image</span>
          </div>
          <img
            src={content.image.preview}
            alt={content.image.location}
            className="w-full h-32 object-cover rounded mt-2"
          />
          <p className="text-sm text-green-700 mt-2">
            {content.image.location} - {content.image.countyName}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="w-7 h-7" />
          Admin Communication Channel
        </h2>
        <p className="text-purple-100 mt-1">
          Share data, analytics, and collaborate with other administrators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Messages</h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.senderId === admin?.id;
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-50 border border-blue-200 ml-8'
                        : 'bg-gray-50 border border-gray-200 mr-8'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {isOwnMessage ? 'You' : msg.senderName}
                        </p>
                        <p className="text-xs text-gray-500">{msg.senderCounty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        {!isOwnMessage && !msg.read && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {msg.content && (
                      <p className="text-gray-700 mb-2">{msg.content}</p>
                    )}

                    {msg.sharedContent && renderSharedContent(msg.sharedContent)}

                    {!isOwnMessage && (
                      <p className="text-xs text-gray-500 mt-2">
                        To: {msg.recipientId === 'all' ? 'All Admins' : 'You'}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Compose Message */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Compose Message</h3>

          <div className="space-y-4">
            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {admins.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.name} - {adm.countyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Share Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Content (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleShareChart('Water Stress')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Chart
                </Button>
                <Button
                  onClick={() => handleShareImage(null)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Image
                </Button>
              </div>
            </div>

            {/* Shared Content Preview */}
            {sharedContent && (
              <div className="relative">
                {renderSharedContent(sharedContent)}
                <button
                  onClick={() => setSharedContent(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Communication Stats</h4>
            <div className="space-y-1 text-sm text-purple-700">
              <p>Total Messages: {messages.length}</p>
              <p>Sent: {messages.filter(m => m.senderId === admin?.id).length}</p>
              <p>Received: {messages.filter(m => m.recipientId === admin?.id).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommunication;

