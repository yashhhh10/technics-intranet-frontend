import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckSquare, Users, Calendar, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskPhaseModal from './TaskPhaseModal';
import NewTaskModal from './NewTaskModal';
import { getCurrentUser, canCreateContent, authorizedFetch } from '../utils/auth';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string[];
  team: string;
  startDate: string;
  deadline: string;
  currentPhase: number;
}

const TaskManagementPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const canCreate = canCreateContent(currentUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);


  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedFetch('http://localhost:5001/api/tasks');
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Defensive: ensure data is an array and fields are present
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array');
        }
        setTasks(data.map((task: any) => ({
          id: String(task.id ?? ''),
          title: task.title ?? 'Untitled',
          description: task.description ?? '',
          priority: task.priority ?? undefined,
          status: task.status ?? 'not-started',
          assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [],
          team: task.team ?? '',
          startDate: task.startDate ?? '',
          deadline: task.deadline ?? '',
          currentPhase: typeof task.currentPhase === 'number' ? task.currentPhase : 0
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (newTaskData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo: string[];
    team: string;
    startDate: string;
    deadline: string;
  }) => {
    try {
      const response = await authorizedFetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        body: JSON.stringify(newTaskData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create task: ${response.status} ${response.statusText} - ${errorText}`);
      }
      // After successful POST, fetch the latest tasks from backend
      const res = await authorizedFetch('http://localhost:5001/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks after add');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data.map((task: any) => ({
        id: String(task.id ?? ''),
        title: task.title ?? 'Untitled',
        description: task.description ?? '',
        priority: task.priority ?? undefined,
        status: task.status ?? 'not-started',
        assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [],
        team: task.team ?? '',
        startDate: task.startDate ?? '',
        deadline: task.deadline ?? '',
        currentPhase: typeof task.currentPhase === 'number' ? task.currentPhase : 0
      })) : []);
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const teams = ['All Teams', 'Engineering', 'Design', 'Marketing', 'Product', 'QA'];
  const statuses = ['All Status', 'Not Started', 'In Progress', 'Completed', 'Overdue'];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.some(person => person.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTeam = selectedTeam === 'All Teams' || task.team === selectedTeam;
    
    const matchesStatus = selectedStatus === 'All Status' || 
                         task.status.replace('-', ' ').toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      overdue: tasks.filter(t => t.status === 'overdue').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading tasks...</span>
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
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-purple-100">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Track project progress and team assignments</p>
            </div>
          </div>
          
          {canCreate && (
            <button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <Users className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, or team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[120px]"
              >
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[120px]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4 lg:space-y-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredTasks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}

      {/* Task Phase Modal */}
      <TaskPhaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />

      {/* New Task Modal */}
      {canCreate && (
        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          onSubmit={handleAddTask}
        />
      )}
    </div>
  );
};

export default TaskManagementPage;