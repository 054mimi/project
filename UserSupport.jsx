import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { counties } from '../data/counties';
import {
  MessageSquare,
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserSupport = () => {
  const { user, isGuest } = useAuth();
  const { getSubAdminByCounty } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', type: 'question' });
  const [countyAdmin, setCountyAdmin] = useState(null);

  useEffect(() => {
    if (user?.region) {
      loadTickets();
      const admin = getSubAdminByCounty(user.region);
      setCountyAdmin(admin);
    }
  }, [user]);

  const loadTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem('regenTickets') || '[]');
    const userTickets = allTickets.filter(t => t.userId === user?.id);
    setTickets(userTickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const handleSubmitTicket = () => {
    if (!user) {
      alert('Please sign in to submit a ticket');
      return;
    }

    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const ticket = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      countyId: user.region,
      countyName: counties.find(c => c.id === user.region)?.name,
      subject: newTicket.subject,
      message: newTicket.message,
      type: newTicket.type,
      status: 'pending',
      timestamp: new Date().toISOString(),
      replies: []
    };

    const allTickets = JSON.parse(localStorage.getItem('regenTickets') || '[]');
    allTickets.push(ticket);
    localStorage.setItem('regenTickets', JSON.stringify(allTickets));

    // Create notification for admin
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      recipientId: countyAdmin?.id || 'chief-admin',
      type: 'ticket',
      title: 'New Support Ticket',
      message: `${user.name} submitted a ${newTicket.type}: ${newTicket.subject}`,
      ticketId: ticket.id,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));

    setNewTicket({ subject: '', message: '', type: 'question' });
    loadTickets();
    setActiveTab('tickets');
    alert('Ticket submitted successfully! You will receive a response soon.');
  };

  const faqs = [
    {
      question: 'How do I upload environmental images?',
      answer: 'Sign in to your account, select your county, and click the "Upload Image" button in the header. Add a location caption (e.g., "Juja", "Kayole") and optional comments, then submit.'
    },
    {
      question: 'Can I view images from other counties?',
      answer: 'Yes! Use the region selector in the header to switch between counties. You can view images from any county, but you can only upload images to your registered county after signing in.'
    },
    {
      question: 'How does the like system work?',
      answer: 'Each user can like an image once. Clicking the heart icon again will unlike it. All likes are synced across the system and visible to everyone in that county.'
    },
    {
      question: 'What is ReGen Insight?',
      answer: 'ReGen Insight is an AI-powered platform for environmental monitoring, land restoration, and carbon credit verification across Kenya\'s 47 counties. It combines satellite data, community input, and blockchain technology.'
    },
    {
      question: 'How do I contact my county administrator?',
      answer: 'Visit the "Contact Info" tab to find your county administrator\'s email and phone number. They can help with environmental concerns specific to your region.'
    },
    {
      question: 'What can I report to my county admin?',
      answer: 'You can report environmental degradation, water stress, illegal logging, pollution, reforestation initiatives, and wildlife concerns affecting your county.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! User credentials are stored separately from admin credentials. All data is encrypted and follows best practices for security and privacy.'
    },
    {
      question: 'Can I use the app as a guest?',
      answer: 'Yes! Guests can view all counties and their data, but you must sign in to upload images and interact with the community.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <HelpCircle className="w-7 h-7" />
          Help & Support
        </h2>
        <p className="text-indigo-100 mt-1">
          Get answers to common questions or submit a support ticket
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="w-5 h-5 inline mr-2" />
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'submit'
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Send className="w-5 h-5 inline mr-2" />
            Submit Ticket
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'tickets'
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            My Tickets
            {tickets.filter(t => t.status !== 'resolved').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {tickets.filter(t => t.status !== 'resolved').length}
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                >
                  <summary className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-gray-600 pl-7">{faq.answer}</p>
                </details>
              ))}
            </div>
          )}

          {/* Submit Ticket Tab */}
          {activeTab === 'submit' && (
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Submit a Support Ticket</h3>
              
              {isGuest ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Sign In Required</h4>
                    <p className="text-sm text-yellow-700">
                      Please sign in to submit a support ticket. This helps us track your requests and respond appropriately.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Type
                    </label>
                    <select
                      value={newTicket.type}
                      onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="question">Question</option>
                      <option value="issue">Technical Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="report">Environmental Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Brief description of your concern"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      placeholder="Provide detailed information about your concern..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-sm text-indigo-800">
                      <strong>Your ticket will be sent to:</strong><br />
                      {countyAdmin ? (
                        <>
                          {countyAdmin.name} - {counties.find(c => c.id === user.region)?.name} County Administrator<br />
                          <span className="text-xs">{countyAdmin.contactEmail}</span>
                        </>
                      ) : (
                        'Chief Administrator (chief.raydun@gmail.com)'
                      )}
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmitTicket}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Ticket
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">My Support Tickets</h3>
              
              {isGuest ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Sign In Required</h4>
                    <p className="text-sm text-yellow-700">
                      Please sign in to view your support tickets.
                    </p>
                  </div>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No tickets yet</p>
                  <p className="text-sm text-gray-400">Submit a ticket if you need help</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{ticket.subject}</h4>
                          <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{ticket.type}</span>
                            <span>•</span>
                            <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{ticket.status}</span>
                        </div>
                      </div>

                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Admin Response:</p>
                          {ticket.replies.map((reply, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                              <p className="text-sm text-green-800">{reply.message}</p>
                              <p className="text-xs text-green-600 mt-1">
                                {reply.adminName} - {new Date(reply.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSupport;

