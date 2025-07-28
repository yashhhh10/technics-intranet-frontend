import React from 'react';
import { X } from 'lucide-react';
import BirthdayCard from './BirthdayCard';
import AnniversaryCard from './AnniversaryCard';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onToggle }) => {
  const moreBirthdays = [
    { name: "Alex Rodriguez", role: "Design", age: 26 },
    { name: "Jennifer Lee", role: "Operations", age: 31 },
    { name: "David Kim", role: "Product", age: 28 },
    { name: "Sophie Turner", role: "Marketing", age: 25 },
    { name: "James Wilson", role: "Engineering", age: 33 }
  ];

  const moreAnniversaries = [
    { name: "Maria Garcia", role: "Legal", years: "3y" },
    { name: "Robert Taylor", role: "IT", years: "7y" },
    { name: "Amanda White", role: "Customer Success", years: "2y" },
    { name: "Kevin Brown", role: "Sales", years: "4y" },
    { name: "Rachel Green", role: "HR", years: "6y" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Right Sidebar */}
      <div className={`fixed xl:static inset-y-0 right-0 z-50 w-80 xl:w-64 2xl:w-80 bg-white border-l border-gray-200 p-4 lg:p-6 space-y-6 lg:space-y-8 transition-transform duration-300 ease-in-out overflow-y-auto resize-x min-w-[240px] max-w-[400px] ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}>
        {/* Mobile close button */}
        <button
          onClick={onToggle}
          className="xl:hidden absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Happy Birthday Section */}
        <div>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🎉</span>
            <h3 className="text-lg font-semibold text-pink-600">Happy Birthday!</h3>
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <BirthdayCard
              name="Sarah Johnson"
              role="Marketing"
              age={28}
            />
            <BirthdayCard
              name="Mike Chen"
              role="Engineering"
              age={32}
            />
            <BirthdayCard
              name="Emma Davis"
              role="HR"
              age={29}
            />
            {moreBirthdays.map((birthday, index) => (
              <BirthdayCard
                key={index}
                name={birthday.name}
                role={birthday.role}
                age={birthday.age}
              />
            ))}
          </div>
        </div>

        {/* Work Anniversaries Section */}
        <div>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🏆</span>
            <h3 className="text-lg font-semibold text-blue-600">Work Anniversaries</h3>
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <AnniversaryCard
              name="John Williams"
              role="Sales"
              years="5y"
            />
            <AnniversaryCard
              name="Lisa Anderson"
              role="Finance"
              years="10y"
            />
            {moreAnniversaries.map((anniversary, index) => (
              <AnniversaryCard
                key={index}
                name={anniversary.name}
                role={anniversary.role}
                years={anniversary.years}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;