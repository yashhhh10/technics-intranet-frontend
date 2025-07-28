import React, { useState } from 'react';
import { Search, Filter, MessageCircle, Plus, ThumbsUp, ThumbsDown, Heart, Smile, MessageSquare, BarChart3, Bell, User, Calendar, Clock, MoreVertical } from 'lucide-react';
import NewDiscussionModal from './NewDiscussionModal';
import DiscussionDetailModal from './DiscussionDetailModal';
import { getCurrentUser, canCreateContent } from '../utils/auth';

interface Reaction {
  employeeId: string;
  reaction: string;
}

interface Comment {
  employeeId: string;
  message: string;
  timestamp: Date;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  role: string;
  type: 'poll' | 'forum' | 'announcement';
  options?: string[];
  reactions: Reaction[];
  comments: Comment[];
  createdAt: string;
  pollResponses?: { [key: string]: string }; // For poll responses
}

const ChatMessagesPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const canCreate = canCreateContent(currentUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isNewDiscussionModalOpen, setIsNewDiscussionModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Q1 Company Goals Discussion',
      content: 'Let\'s discuss our priorities and objectives for the first quarter. What areas should we focus on to achieve maximum growth?',
      createdBy: 'Sarah Johnson',
      role: 'HR',
      type: 'forum',
      reactions: [
        { employeeId: 'john_doe', reaction: '👍' },
        { employeeId: 'mike_chen', reaction: '❤️' },
        { employeeId: 'emma_davis', reaction: '👍' }
      ],
      comments: [
        { employeeId: 'John Doe', message: 'I think we should focus on customer acquisition and product development.', timestamp: new Date('2024-01-15T10:30:00') },
        { employeeId: 'Mike Chen', message: 'Agreed! Also improving our internal processes would be beneficial.', timestamp: new Date('2024-01-15T11:15:00') }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Preferred Work Schedule',
      content: 'We\'re considering flexible work arrangements. What would be your preferred work schedule?',
      createdBy: 'David Wilson',
      role: 'VP',
      type: 'poll',
      options: ['Full Remote', 'Hybrid (3 days office)', 'Full Office', 'Flexible Hours'],
      reactions: [
        { employeeId: 'sarah_wilson', reaction: '👍' },
        { employeeId: 'alex_rodriguez', reaction: '👍' }
      ],
      comments: [
        { employeeId: 'Sarah Wilson', message: 'Hybrid seems like the best balance for collaboration and flexibility.', timestamp: new Date('2024-01-14T14:20:00') }
      ],
      createdAt: '2024-01-14',
      pollResponses: {
        'john_doe': 'Hybrid (3 days office)',
        'sarah_wilson': 'Hybrid (3 days office)',
        'mike_chen': 'Full Remote',
        'emma_davis': 'Flexible Hours'
      }
    },
    {
      id: '3',
      title: 'New Health Insurance Benefits',
      content: 'We\'re excited to announce our enhanced health insurance package starting February 1st. This includes dental, vision, and mental health coverage with reduced premiums.',
      createdBy: 'Lisa Anderson',
      role: 'director',
      type: 'announcement',
      reactions: [
        { employeeId: 'john_doe', reaction: '🎉' },
        { employeeId: 'sarah_wilson', reaction: '❤️' },
        { employeeId: 'mike_chen', reaction: '👍' },
        { employeeId: 'emma_davis', reaction: '🎉' }
      ],
      comments: [
        { employeeId: 'John Doe', message: 'This is fantastic news! Thank you for prioritizing employee wellbeing.', timestamp: new Date('2024-01-13T09:45:00') },
        { employeeId: 'Emma Davis', message: 'The mental health coverage is especially appreciated.', timestamp: new Date('2024-01-13T10:30:00') }
      ],
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Team Building Activity Ideas',
      content: 'Planning our next team building event. What type of activities would you enjoy most?',
      createdBy: 'Jennifer Martinez',
      role: 'marketing head',
      type: 'poll',
      options: ['Outdoor Adventure', 'Cooking Class', 'Escape Room', 'Sports Tournament', 'Art Workshop'],
      reactions: [
        { employeeId: 'alex_rodriguez', reaction: '👍' },
        { employeeId: 'jennifer_lee', reaction: '😊' }
      ],
      comments: [],
      createdAt: '2024-01-12',
      pollResponses: {
        'john_doe': 'Escape Room',
        'sarah_wilson': 'Cooking Class',
        'alex_rodriguez': 'Sports Tournament'
      }
    },
    {
      id: '5',
      title: 'Remote Work Policy Updates',
      content: 'We\'ve updated our remote work policy to provide more flexibility. Key changes include flexible core hours and improved home office stipends.',
      createdBy: 'Michael Brown',
      role: 'tech head',
      type: 'announcement',
      reactions: [
        { employeeId: 'sarah_wilson', reaction: '👍' },
        { employeeId: 'mike_chen', reaction: '🎉' }
      ],
      comments: [
        { employeeId: 'Sarah Wilson', message: 'The flexible core hours will really help with work-life balance.', timestamp: new Date('2024-01-11T16:20:00') }
      ],
      createdAt: '2024-01-11'
    }
  ]);

  const handleAddDiscussion = (newDiscussion: Omit<Discussion, 'id' | 'createdAt' | 'reactions' | 'comments'>) => {
    const discussion: Discussion = {
      ...newDiscussion,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      reactions: [],
      comments: []
    };
    
    setDiscussions(prev => [discussion, ...prev]);
  };

  const handleReaction = (discussionId: string, reaction: string) => {
    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        const existingReaction = discussion.reactions.find(r => r.employeeId === currentUser.id);
        if (existingReaction) {
          // Update existing reaction
          return {
            ...discussion,
            reactions: discussion.reactions.map(r => 
              r.employeeId === currentUser.id ? { ...r, reaction } : r
            )
          };
        } else {
          // Add new reaction
          return {
            ...discussion,
            reactions: [...discussion.reactions, { employeeId: currentUser.id, reaction }]
          };
        }
      }
      return discussion;
    }));
  };

  const handlePollResponse = (discussionId: string, option: string) => {
    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId && discussion.type === 'poll') {
        return {
          ...discussion,
          pollResponses: {
            ...discussion.pollResponses,
            [currentUser.id]: option
          }
        };
      }
      return discussion;
    }));
  };

  const handleAddComment = (discussionId: string, message: string) => {
    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        const newComment: Comment = {
          employeeId: currentUser.name,
          message,
          timestamp: new Date()
        };
        return {
          ...discussion,
          comments: [...discussion.comments, newComment]
        };
      }
      return discussion;
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'forum': return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'announcement': return <Bell className="w-5 h-5 text-orange-600" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'poll': return 'bg-blue-100 text-blue-800';
      case 'forum': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReactionCount = (reactions: Reaction[], reaction: string) => {
    return reactions.filter(r => r.reaction === reaction).length;
  };

  const getUserReaction = (reactions: Reaction[]) => {
    return reactions.find(r => r.employeeId === currentUser.id)?.reaction;
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || 
                       discussion.type === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const types = ['All Types', 'Forum', 'Poll', 'Announcement'];

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-indigo-100">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Chat & Messages</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Company discussions, polls, and announcements</p>
            </div>
          </div>
          
          {canCreate && (
            <button 
              onClick={() => setIsNewDiscussionModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredDiscussions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredDiscussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
              {/* Discussion Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start flex-1">
                  <div className="mr-3 mt-1">
                    {getTypeIcon(discussion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(discussion.type)}`}>
                        {discussion.type.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        By {discussion.createdBy} ({discussion.role})
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {discussion.createdAt}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {discussion.comments.length} comments
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4">{discussion.content}</p>

              {/* Poll Options */}
              {discussion.type === 'poll' && discussion.options && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Poll Options:</h4>
                  <div className="space-y-2">
                    {discussion.options.map((option, index) => {
                      const responses = Object.values(discussion.pollResponses || {});
                      const optionCount = responses.filter(r => r === option).length;
                      const percentage = responses.length > 0 ? (optionCount / responses.length) * 100 : 0;
                      const userSelected = discussion.pollResponses?.[currentUser.id] === option;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handlePollResponse(discussion.id, option)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            userSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{option}</span>
                            <span className="text-sm text-gray-500">{optionCount} votes ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reactions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {['👍', '❤️', '😊', '🎉'].map(reaction => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(discussion.id, reaction)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
                        getUserReaction(discussion.reactions) === reaction
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span>{reaction}</span>
                      <span>{getReactionCount(discussion.reactions, reaction)}</span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedDiscussion(discussion);
                    setIsDetailModalOpen(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredDiscussions.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredDiscussions.length} of {discussions.length} discussions
        </div>
      )}

      {/* New Discussion Modal */}
      {canCreate && (
        <NewDiscussionModal
          isOpen={isNewDiscussionModalOpen}
          onClose={() => setIsNewDiscussionModalOpen(false)}
          onSubmit={handleAddDiscussion}
        />
      )}

      {/* Discussion Detail Modal */}
      <DiscussionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        discussion={selectedDiscussion}
        onAddComment={handleAddComment}
        onReaction={handleReaction}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChatMessagesPage;