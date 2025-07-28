import React from 'react';

interface TalkCardProps {
  title: string;
  category: string;
}

const TalkCard: React.FC<TalkCardProps> = ({ title, category }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tech talk': return 'bg-blue-100 text-blue-800';
      case 'leadership': return 'bg-purple-100 text-purple-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'process': return 'bg-orange-100 text-orange-800';
      case 'business': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-medium text-gray-900 flex-1 mr-3">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getCategoryColor(category)}`}>
          {category}
        </span>
      </div>
    </div>
  );
};

export default TalkCard;