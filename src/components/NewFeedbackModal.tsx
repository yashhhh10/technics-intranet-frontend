import React, { useState, useEffect } from 'react';
import { X, MessageSquare, User } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

interface Feedback {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface NewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { content: string }) => void;
  editingFeedback?: Feedback | null;
}

const NewFeedbackModal: React.FC<NewFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingFeedback
}) => {
  const currentUser = getCurrentUser();
  const isEditing = !!editingFeedback;
  
  const [formData, setFormData] = useState({
    content: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingFeedback) {
      setFormData({
        content: editingFeedback.content
      });
    } else {
      setFormData({
        content: ''
      });
    }
  }, [editingFeedback]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Feedback content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Feedback must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        content: formData.content.trim()
      });
      
      // Reset form
      setFormData({
        content: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 bg-green-100">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Feedback' : 'Add Feedback'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? 'Update your feedback' : 'Share your thoughts and suggestions'}
              </p>
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
          {/* User Info (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Submitted By
            </label>
            <input
              type="text"
              value={currentUser.name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Share your thoughts, suggestions, or feedback about the system, processes, or any improvements you'd like to see..."
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 10 characters required. Current: {formData.content.length}
            </p>
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
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium"
            >
              {isEditing ? 'Update Feedback' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFeedbackModal;