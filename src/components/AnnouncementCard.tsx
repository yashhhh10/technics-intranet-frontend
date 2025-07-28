import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  date: string;
  description: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  priority,
  category,
  date,
  description
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'benefits': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
      </div>

      {(date) && (
        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
          {date && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {date}
            </div>
          )}
          
        </div>
      )}

      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default AnnouncementCard;