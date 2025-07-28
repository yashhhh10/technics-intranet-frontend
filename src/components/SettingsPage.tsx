import React, { useState } from 'react';
import { Settings, Moon, Sun, User, LogOut, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

const SettingsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual theme switching logic
    // For now, we'll just toggle the state
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    // Here you would implement actual logout logic
    // Clear tokens, redirect to login, etc.
    console.log('Logging out...');
    // For demo purposes, we'll just show an alert
    alert('Logout functionality would redirect to login page');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-gray-100">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm lg:text-base text-gray-500 mt-1">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Personal Details
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
              {getInitials(currentUser.name)}
            </div>
            
            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-900">{currentUser.name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-900 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{currentUser.email}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{currentUser.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Theme Preferences</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="w-5 h-5 mr-3 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 mr-3 text-yellow-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-sm text-gray-500">
                  {isDarkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;