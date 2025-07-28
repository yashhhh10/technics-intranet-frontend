import React from 'react';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
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
}

interface TaskPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskPhaseModal: React.FC<TaskPhaseModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const phases = [
    {
      name: 'Planning',
      description: 'Project planning, requirements gathering, and resource allocation',
      duration: '1-2 weeks'
    },
    {
      name: 'Designing',
      description: 'UI/UX design, system architecture, and technical specifications',
      duration: '2-3 weeks'
    },
    {
      name: 'Implementing',
      description: 'Development, coding, and feature implementation',
      duration: '4-6 weeks'
    },
    {
      name: 'Testing',
      description: 'Quality assurance, bug fixes, and performance testing',
      duration: '1-2 weeks'
    },
    {
      name: 'Deployment',
      description: 'Production deployment, monitoring, and final delivery',
      duration: '1 week'
    }
  ];

  const getPhaseStatus = (index: number) => {
    if (index < task.currentPhase) return 'completed';
    if (index === task.currentPhase) return 'current';
    return 'pending';
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'current': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-red-100 border-red-300 text-red-800';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{task.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Development Phases Overview</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Team:</span>
              <p className="text-gray-600">{task.team}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Assigned To:</span>
              <p className="text-gray-600">{task.assignedTo.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Start Date:</span>
              <p className="text-gray-600">{task.startDate}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Deadline:</span>
              <p className="text-gray-600">{task.deadline}</p>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Development Phases</h3>
          
          <div className="space-y-4">
            {phases.map((phase, index) => {
              const status = getPhaseStatus(index);
              return (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 transition-all ${getPhaseColor(status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getPhaseIcon(status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">
                            Phase {index + 1}: {phase.name}
                          </h4>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {status === 'completed' && '✓ Completed'}
                      {status === 'current' && '⚡ In Progress'}
                      {status === 'pending' && '⏳ Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Progress Summary</h4>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                Phase {task.currentPhase + 1} of {phases.length}: {phases[task.currentPhase].name}
              </span>
              <span className="text-blue-800 font-semibold">
                {Math.round(((task.currentPhase + 1) / phases.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((task.currentPhase + 1) / phases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPhaseModal;