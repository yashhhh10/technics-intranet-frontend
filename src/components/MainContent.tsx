import React, { useEffect, useState } from 'react';
import { Megaphone, ExternalLink, MessageSquare } from 'lucide-react';
import AnnouncementCard from './AnnouncementCard';
import TalkCard from './TalkCard';
import { authorizedFetch } from '../utils/auth';

const MainContent = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedFetch('http://localhost:5001/api/announcements');
        if (!response.ok) throw new Error('Failed to fetch announcements');
        const data = await response.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const moreTalks = [
    { title: "Effective Remote Communication", category: "Leadership" },
    { title: "Introduction to Cloud Computing", category: "Tech Talk" },
    { title: "Data Privacy and GDPR Compliance", category: "Legal" },
    { title: "Mental Health in the Workplace", category: "Wellness" },
    { title: "Agile Project Management", category: "Process" },
    { title: "Customer Success Strategies", category: "Business" },
    { title: "Advanced React Patterns", category: "Tech Talk" },
    { title: "Building High-Performance Teams", category: "Leadership" },
    { title: "Financial Planning for Employees", category: "Wellness" },
    { title: "DevOps Best Practices", category: "Tech Talk" }
  ];

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 space-y-6 lg:space-y-8 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading announcements...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-6 space-y-6 lg:space-y-8 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 lg:space-y-8 overflow-y-auto">
      {/* Announcements Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-4 bg-blue-100">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
              <p className="text-sm text-gray-500 hidden sm:block">Stay updated with the latest company news</p>
            </div>
          </div>
          <a 
            href="#" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="hidden sm:inline">View All</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-500">No announcements to display</p>
            </div>
          ) : (
            announcements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id || index}
                title={announcement.title}
                priority={announcement.priority}
                category={announcement.category}
                date={announcement.date}
                description={announcement.description}
              />
            ))
          )}
        </div>
      </div>

      {/* Recent Talks Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-4 bg-purple-100">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Talks</h2>
              <p className="text-sm text-gray-500 hidden sm:block">Catch up on the latest presentations and discussions</p>
            </div>
          </div>
          <a 
            href="#" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="hidden sm:inline">View Library</span>
            <span className="sm:hidden">Library</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          <TalkCard
            title="Introduction to AI in the Workplace"
            category="Tech Talk"
          />
          
          <TalkCard
            title="Building Resilient Teams"
            category="Leadership"
          />

          {moreTalks.map((talk, index) => (
            <TalkCard
              key={index}
              title={talk.title}
              category={talk.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;