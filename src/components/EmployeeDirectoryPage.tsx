import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Mail, Phone, MapPin } from 'lucide-react';
import EmployeeDetailModal from './EmployeeDetailModal';
import { authorizedFetch } from '../utils/auth';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  joinDate: string;
  manager: string;
  skills: string[];
  bio: string;
  avatar?: string;
}

const EmployeeDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedFetch('http://localhost:5001/api/employee');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const departments = ['All Departments', 'Information Technology', 'Design', 'Marketing', 'Human Resources', 'Executive', 'Finance', 'Customer Success'];

  // Define hierarchy order for positions
  const positionHierarchy = [
    'Chief Executive Officer',
    'VP of Human Resources', 
    'Engineering Manager',
    'Design Director',
    'Marketing Head',
    'Finance Director',
    'Senior Software Engineer',
    'UX/UI Designer',
    'Marketing Specialist',
    'HR Business Partner',
    'Financial Analyst',
    'Customer Success Manager'
  ];

  const getPositionRank = (position: string) => {
    const index = positionHierarchy.indexOf(position);
    return index === -1 ? 999 : index; // Unknown positions go to the end
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All Departments' ||
        employee.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => getPositionRank(a.position) - getPositionRank(b.position));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Information Technology': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Human Resources': 'bg-orange-100 text-orange-800',
      'Executive': 'bg-red-100 text-red-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Customer Success': 'bg-cyan-100 text-cyan-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading employees...</span>
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
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-emerald-100">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Employee Directory</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Connect with your colleagues across the organization</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees by name, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[180px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="space-y-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id}
                onClick={() => handleEmployeeClick(employee)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-300 group"
              >
                {/* Avatar */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-lg font-semibold text-emerald-700 mb-3 group-hover:bg-emerald-200 transition-colors">
                    {getInitials(employee.name)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{employee.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-2">{employee.position}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{employee.location}</span>
                  </div>
                </div>

                {/* View Details Hint */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center group-hover:text-emerald-600 transition-colors">
                    Click to view full profile
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredEmployees.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeeDirectoryPage;