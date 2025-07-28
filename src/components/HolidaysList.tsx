import React, { useState } from 'react';
import { Calendar, Plus, Search } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface HolidaysPageProps {
  userRole?: 'admin' | 'hr' | 'employee';
}

const HolidaysPage: React.FC<HolidaysPageProps> = ({ userRole = 'employee' }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year\'s Day', date: '2024-01-01' },
    { id: '2', name: 'Republic Day', date: '2024-01-26' },
    { id: '3', name: 'Holi', date: '2024-03-25' },
    { id: '4', name: 'Good Friday', date: '2024-03-29' },
    { id: '5', name: 'Independence Day', date: '2024-08-15' },
    { id: '6', name: 'Gandhi Jayanti', date: '2024-10-02' },
    { id: '7', name: 'Diwali', date: '2024-11-01' },
    { id: '8', name: 'Christmas Day', date: '2024-12-25' },
    { id: '9', name: 'Company Foundation Day', date: '2024-09-15' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState<{ name: string; date: string }>({ name: '', date: '' });

  const filteredHolidays = holidays.filter(holiday =>
    holiday.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const holiday: Holiday = {
        id: Date.now().toString(),
        name: newHoliday.name,
        date: newHoliday.date,
      };
      setHolidays([...holidays, holiday]);
      setNewHoliday({ name: '', date: '' });
      setShowAddModal(false);
    }
  };

  const canAddHoliday = userRole === 'admin' || userRole === 'hr';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Holidays</h1>
            <p className="text-gray-600 mt-1">Organization approved holidays and celebrations</p>
          </div>
        </div>
        {canAddHoliday && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            New Holiday
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Holidays Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHolidays.map((holiday) => {
                const date = new Date(holiday.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                return (
                  <tr key={holiday.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-3" size={18} />
                        <span className="text-sm font-medium text-gray-900">{holiday.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {dayName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredHolidays.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No holidays found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Holiday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Holiday</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter holiday name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHoliday}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysPage;