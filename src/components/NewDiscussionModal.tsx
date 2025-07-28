import React, { useState } from 'react';
import { X, MessageCircle, BarChart3, Bell, User, Building } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discussion: {
    title: string;
    content: string;
    createdBy: string;
    role: string;
    type: 'poll' | 'forum' | 'announcement';
    options?: string[];
  }) => void;
}

const NewDiscussionModal: React.FC<NewDiscussionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'forum' as 'poll' | 'forum' | 'announcement',
    options: ['', ''] // Default 2 empty options for polls
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.type === 'poll') {
      const validOptions = formData.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 poll options are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const discussionData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        createdBy: currentUser.name,
        role: currentUser.role,
        type: formData.type,
        ...(formData.type === 'poll' && {
          options: formData.options.filter(opt => opt.trim())
        })
      };
      
      onSubmit(discussionData);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'forum',
        options: ['', '']
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addPollOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removePollOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'forum': return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'announcement': return <Bell className="w-5 h-5 text-orange-600" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 bg-indigo-100">
              {getTypeIcon(formData.type)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Discussion</h2>
              <p className="text-sm text-gray-500">Start a conversation with your team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discussion Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'forum', label: 'Forum', icon: MessageCircle, color: 'green', desc: 'Open discussion' },
                { value: 'poll', label: 'Poll', icon: BarChart3, color: 'blue', desc: 'Collect votes' },
                { value: 'announcement', label: 'Announcement', icon: Bell, color: 'orange', desc: 'Share news' }
              ].map(({ value, label, icon: Icon, color, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange('type', value)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    formData.type === value
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <Icon className={`w-4 h-4 mr-2 text-${color}-600`} />
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter discussion title..."
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={
                formData.type === 'poll' 
                  ? 'Describe what you want to poll about...'
                  : formData.type === 'announcement'
                  ? 'Enter your announcement details...'
                  : 'Start the discussion...'
              }
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          {/* Poll Options */}
          {formData.type === 'poll' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Options *
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePollOption(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}
              <button
                type="button"
                onClick={addPollOption}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* Author Info (Read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Created By
              </label>
              <input
                type="text"
                value={currentUser.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Role
              </label>
              <input
                type="text"
                value={currentUser.role}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium"
            >
              Create {formData.type === 'poll' ? 'Poll' : formData.type === 'announcement' ? 'Announcement' : 'Forum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionModal;