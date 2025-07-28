import React from 'react';
import { Calendar, Clock, User, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string[];
  team: string;
  startDate: string;
  deadline: string;
  currentPhase: number;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  priority,
  status,
  assignedTo,
  team,
  startDate,
  deadline,
  currentPhase,
  onClick
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTeamColor = (team: string) => {
    switch (team.toLowerCase()) {
      case 'engineering': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'product': return 'bg-orange-100 text-orange-800';
      case 'qa': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const phases = ['Planning', 'Designing', 'Implementing', 'Testing', 'Deployment'];
  const progressPercentage = ((currentPhase + 1) / phases.length) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>
        </div>
        
    <div className="flex flex-wrap gap-2">
        {priority && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
            {priority.toUpperCase()}
            </span>
        )}
        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status.replace('-', ' ').toUpperCase()}
        </span>
    </div>
    </div>


      {/* Team and Assignment Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTeamColor(team)}`}>
            {team}
          </span>
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {assignedTo.slice(0, 2).join(', ')}
          {assignedTo.length > 2 && ` +${assignedTo.length - 2} more`}
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Start: {startDate}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Due: {deadline}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current Phase */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Current Phase:</span> {phases[currentPhase]}
      </div>
    </div>
  );
};

export default TaskCard;