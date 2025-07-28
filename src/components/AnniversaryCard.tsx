import React from 'react';
import { Star } from 'lucide-react';

interface AnniversaryCardProps {
  name: string;
  role: string;
  years: string;
}

const AnniversaryCard: React.FC<AnniversaryCardProps> = ({ name, role, years }) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Star className="w-5 h-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="text-sm font-semibold text-blue-500">{years}</div>
    </div>
  );
};

export default AnniversaryCard;