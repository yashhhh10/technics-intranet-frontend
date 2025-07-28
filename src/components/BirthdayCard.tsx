import React from 'react';
import { Gift } from 'lucide-react';

interface BirthdayCardProps {
  name: string;
  role: string;
  age: number;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ name, role, age }) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Gift className="w-5 h-5 text-pink-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="text-lg font-bold text-pink-500">{age}</div>
    </div>
  );
};

export default BirthdayCard;