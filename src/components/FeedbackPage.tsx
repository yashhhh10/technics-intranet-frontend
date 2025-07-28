import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Plus, User, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react';
import NewFeedbackModal from './NewFeedbackModal';
import { getCurrentUser, hasRole, authorizedFetch } from '../utils/auth';

interface Feedback {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

const FeedbackPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const isAdmin = hasRole(currentUser, 'admin');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedFetch('http://localhost:5001/api/feedback');
        if (!response.ok) {
          throw new Error(`Failed to fetch feedback: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array');
        }
        setFeedback(data.map((item: any) => ({
          id: String(item.id ?? item._id ?? ''),
          userId: item.userId ?? '',
          content: item.content ?? '',
          createdAt: item.createdAt ? item.createdAt.split('T')[0] : ''
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleAddFeedback = async (newFeedback: { content: string }) => {
    try {
      const response = await authorizedFetch('http://localhost:5001/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          content: newFeedback.content,
          userId: currentUser.name
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
      }
      const created = await response.json();
      const feedbackItem: Feedback = {
        id: String(created.id ?? created._id ?? Date.now().toString()),
        userId: created.userId ?? currentUser.name,
        content: created.content ?? newFeedback.content,
        createdAt: created.createdAt ? created.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      };
      setFeedback(prev => [feedbackItem, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback');
    }
  };

  const handleUpdateFeedback = (updatedFeedback: { content: string }) => {
    if (editingFeedback) {
      setFeedback(prev => prev.map(item => 
        item.id === editingFeedback.id 
          ? { ...item, content: updatedFeedback.content }
          : item
      ));
      setEditingFeedback(null);
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setFeedback(prev => prev.filter(item => item.id !== feedbackId));
  };

  const canModifyFeedback = (feedbackItem: Feedback) => {
    return feedbackItem.userId === currentUser.name || isAdmin;
  };

  const filteredFeedback = feedback.filter(item => 
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading feedback...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-green-100">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Feedback</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Share your thoughts and suggestions</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm lg:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feedback
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
              {/* Feedback Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700 mr-3">
                    {item.userId.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {item.userId}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
                
                {canModifyFeedback(item) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingFeedback(item);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{item.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredFeedback.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredFeedback.length} of {feedback.length} feedback items
        </div>
      )}

      {/* New/Edit Feedback Modal */}
      <NewFeedbackModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFeedback(null);
        }}
        onSubmit={editingFeedback ? handleUpdateFeedback : handleAddFeedback}
        editingFeedback={editingFeedback}
      />
    </div>
  );
};

export default FeedbackPage;