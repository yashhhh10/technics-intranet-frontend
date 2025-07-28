import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, User, Building, Award, Briefcase, Clock } from 'lucide-react';

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

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  if (!isOpen || !employee) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTenure = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return 'Less than a month';
    }
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

  const getSkillColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {getInitials(employee.name)}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{employee.name}</h1>
              <p className="text-lg text-emerald-100 mb-3">{employee.position}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full bg-white bg-opacity-20 text-white`}>
                  {employee.department}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-white bg-opacity-20 text-white">
                  {calculateTenure(employee.joinDate)} at company
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <a href={`mailto:${employee.email}`} className="text-emerald-600 hover:text-emerald-700">
                    {employee.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <a href={`tel:${employee.phone}`} className="text-emerald-600 hover:text-emerald-700">
                    {employee.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">{employee.location}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Building className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Reports to</p>
                  <p className="text-gray-600">{employee.manager}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Birthday</p>
                  <p className="text-gray-600">{formatDate(employee.birthday)}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Join Date</p>
                  <p className="text-gray-600">{formatDate(employee.joinDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              About
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{employee.bio}</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-emerald-600" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-2 text-sm font-medium rounded-full ${getSkillColor(index)}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;