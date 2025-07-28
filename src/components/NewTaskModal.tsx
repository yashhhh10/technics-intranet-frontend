import React, { useState } from 'react';
import { X, Calendar, Clock, User, Users, AlertTriangle } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo: string[];
    team: string;
    startDate: string;
    deadline: string;
  }) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: [] as string[],
    team: '',
    startDate: '',
    deadline: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assigneeInput, setAssigneeInput] = useState('');

  const teams = ['Engineering', 'Design', 'Marketing', 'Product', 'QA', 'Operations', 'Sales'];
  
  const teamMembers: Record<string, string[]> = {
    'Engineering': ['John Doe', 'Sarah Wilson', 'Alex Rodriguez', 'Jennifer Lee', 'Robert Taylor'],
    'Design': ['Emma Davis', 'Mike Chen', 'Sophie Turner'],
    'Marketing': ['Lisa Anderson', 'David Kim', 'Amanda White'],
    'Product': ['Kevin Brown', 'Rachel Green', 'James Wilson'],
    'QA': ['Maria Garcia', 'Thomas Anderson'],
    'Operations': ['Michael Johnson', 'Jessica Brown'],
    'Sales': ['Daniel Wilson', 'Laura Davis']
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    if (!formData.team) {
      newErrors.team = 'Team selection is required';
    }
    if (formData.assignedTo.length === 0) {
      newErrors.assignedTo = 'At least one team member must be assigned';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    if (formData.startDate && formData.deadline && formData.startDate >= formData.deadline) {
      newErrors.deadline = 'Deadline must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: [],
        team: '',
        startDate: '',
        deadline: ''
      });
      setAssigneeInput('');
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

  const addAssignee = (member: string) => {
    if (!formData.assignedTo.includes(member)) {
      handleInputChange('assignedTo', [...formData.assignedTo, member]);
    }
    setAssigneeInput('');
  };

  const removeAssignee = (member: string) => {
    handleInputChange('assignedTo', formData.assignedTo.filter(m => m !== member));
  };

  const availableMembers = formData.team ? teamMembers[formData.team] || [] : [];
  const filteredMembers = availableMembers.filter(member => 
    member.toLowerCase().includes(assigneeInput.toLowerCase()) &&
    !formData.assignedTo.includes(member)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 bg-purple-100">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-500">Assign a new task to your team members</p>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title..."
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the task requirements and objectives..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Priority and Team Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team *
              </label>
              <select
                value={formData.team}
                onChange={(e) => {
                  handleInputChange('team', e.target.value);
                  handleInputChange('assignedTo', []); // Reset assignees when team changes
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.team ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select team...</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              {errors.team && <p className="mt-1 text-sm text-red-600">{errors.team}</p>}
            </div>
          </div>

          {/* Team Members Assignment */}
          {formData.team && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Assign Team Members *
              </label>
              
              {/* Selected Members */}
              {formData.assignedTo.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.assignedTo.map(member => (
                      <span
                        key={member}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => removeAssignee(member)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Search */}
              <div className="relative">
                <input
                  type="text"
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.assignedTo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Search team members..."
                />
                
                {/* Dropdown */}
                {assigneeInput && filteredMembers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredMembers.map(member => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => addAssignee(member)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>}
            </div>
          )}

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Deadline *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.deadline ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
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
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors font-medium"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;