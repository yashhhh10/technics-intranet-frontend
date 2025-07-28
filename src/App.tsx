import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import LoginPage from './components/login';
import AnnouncementsPage from './components/AnnouncementsPage';
import TaskManagementPage from './components/TaskManagementPage';
import HolidaysPage from './components/HolidaysList';
import RightSidebar from './components/RightSidebar';
import MobileNavButton from './components/MobileNavButton';
import HelpDeskPage from './components/HelpDeskPage';
import FeedbackPage from './components/FeedbackPage';
import EmployeeDirectoryPage from './components/EmployeeDirectoryPage';
import ChatMessagesPage from './components/ChatMessagesPage';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    // If no token, show login page
    const token = localStorage.getItem('bearerToken');
    return token ? 'dashboard' : 'login';
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  if (currentPage === 'login') {
    return <LoginPage />;
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={toggleSidebar} 
          currentPage={currentPage}
        />
        <div className="flex-1 flex overflow-hidden">
          {currentPage === 'dashboard' ? (
            <>
              <MainContent />
              <RightSidebar isOpen={rightSidebarOpen} onToggle={toggleRightSidebar} />
            </>
          ) : currentPage === 'announcements' ? (
            <AnnouncementsPage />
          ) : currentPage === 'tasks' ? (
            <TaskManagementPage />
          ) : currentPage === 'holidays' ?(
            <HolidaysPage/>
          ) : currentPage === 'help' ?(
            <HelpDeskPage />
          ) : currentPage === 'feedback' ?(
            <FeedbackPage />
          ) : currentPage === 'employees' ?(
            <EmployeeDirectoryPage />
          ) : currentPage === 'chat' ?(
            <ChatMessagesPage />
          ): (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500">This page is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {currentPage === 'dashboard' && (
        <MobileNavButton onRightSidebarToggle={toggleRightSidebar} />
      )}
    </div>
  );
}

export default App;