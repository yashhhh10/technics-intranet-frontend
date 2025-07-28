import React from 'react';
import { clearToken } from '../utils/auth';
import { 
  Home, 
  Megaphone, 
  CheckSquare,
  Calendar, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  MessageSquare,
  Settings,
  LogOut,
  X,
  Icon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPage, onNavigate }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' },
    { icon: Megaphone, label: 'Announcements', page: 'announcements' },
    { icon: CheckSquare, label: 'Task Management', page: 'tasks' },
    { icon: Calendar, label : 'Holidays', page: 'holidays'},
    { icon: Users, label: 'Employee Directory', page: 'employees' },
    { icon: MessageCircle, label: 'Chat & Messages', page: 'chat' },
    { icon: HelpCircle, label: 'Help Desk', page: 'help' },
    { icon: MessageSquare, label: 'Feedback', page: 'feedback' },
  ];

  const handleLogout = () => {
    clearToken();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-64 xl:w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen transition-transform duration-300 ease-in-out resize-x overflow-hidden min-w-[240px] max-w-[400px] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Mobile close button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-2xl font-bold text-green-700 tracking-wide">
            TECNICS
            <span className="text-red-500 text-xs align-top">®</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="text-sm font-medium text-gray-500 mb-4">Navigation</div>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
              JD
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">John Doe</div>
              <div className="text-xs text-gray-500">Software Engineer</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;