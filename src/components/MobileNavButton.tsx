import React from 'react';
import { Calendar } from 'lucide-react';

interface MobileNavButtonProps {
  onRightSidebarToggle: () => void;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ onRightSidebarToggle }) => {
  return (
    <div className="xl:hidden fixed bottom-6 right-6 z-30">
      <button
        onClick={onRightSidebarToggle}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <Calendar className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileNavButton;