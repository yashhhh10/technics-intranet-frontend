import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Bell, Calendar, MapPin, User, Building } from 'lucide-react';
import NewAnnouncementModal from './NewAnnouncementModal';
import { getCurrentUser, canCreateContent, authorizedFetch } from '../utils/auth';

interface Announcement {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  author: string;
  department: string;
  date: string;
  description: string;
}

const AnnouncementsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const canCreate = canCreateContent(currentUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await authorizedFetch('http://localhost:5001/api/announcements');
        if (!response.ok) throw new Error('Failed to fetch announcements');
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (newAnnouncement: Omit<Announcement, 'id'>) => {
    try {
      console.log(newAnnouncement);
      // Post to backend on port 5001
      const response = await authorizedFetch('http://localhost:5001/api/announcements', {
        method: 'POST',
        body: JSON.stringify(newAnnouncement)
      });
      console.log('New announcement data:', response);
      if (!response.ok) {
        throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
      }
      // After successful POST, fetch the latest announcements from backend
      const res = await authorizedFetch('http://localhost:5001/api/announcements');
      if (!res.ok) throw new Error('Failed to fetch announcements after add');
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err.message || 'Failed to create announcement');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '⚪';
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    switch (category.toLowerCase()) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'benefits': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-indigo-100 text-indigo-800';
      case 'facilities': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'it': return 'bg-cyan-100 text-cyan-800';
      case 'hr': return 'bg-emerald-100 text-emerald-800';
      case 'policy': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = selectedPriority === 'All Priorities' || 
                           announcement.priority === selectedPriority.toLowerCase();
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-blue-100">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Company Announcements</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Stay updated with the latest company news and important updates</p>
            </div>
          </div>
          
          {canCreate && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement, idx) => (
            <div key={announcement.id || idx} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
              {/* Announcement Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">{getPriorityIcon(announcement.priority)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        By {announcement.author}
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {announcement.department}
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {announcement.date}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(announcement.category)}`}>
                    {announcement.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{announcement.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredAnnouncements.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredAnnouncements.length} of {announcements.length} announcements
        </div>
      )}

      {/* New Announcement Modal */}
      {canCreate && (
        <NewAnnouncementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAnnouncement}
        />
      )}
    </div>
  );
};

export default AnnouncementsPage;