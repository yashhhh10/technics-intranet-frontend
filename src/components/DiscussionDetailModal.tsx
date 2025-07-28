import React, { useState } from 'react';
import { X, MessageSquare, Send, User, Calendar, Clock } from 'lucide-react';

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
  pollResponses?: { [key: string]: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface DiscussionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  discussion: Discussion | null;
  onAddComment: (discussionId: string, message: string) => void;
  onReaction: (discussionId: string, reaction: string) => void;
  currentUser: User;
}

const DiscussionDetailModal: React.FC<DiscussionDetailModalProps> = ({
  isOpen,
  onClose,
  discussion,
  onAddComment,
  onReaction,
  currentUser
}) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !discussion) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(discussion.id, newComment.trim());
      setNewComment('');
    }
  };

  const getReactionCount = (reactions: Reaction[], reaction: string) => {
    return reactions.filter(r => r.reaction === reaction).length;
  };

  const getUserReaction = (reactions: Reaction[]) => {
    return reactions.find(r => r.employeeId === currentUser.id)?.reaction;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{discussion.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                By {discussion.createdBy} ({discussion.role})
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {discussion.createdAt}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Discussion Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{discussion.content}</p>
          </div>

          {/* Poll Results */}
          {discussion.type === 'poll' && discussion.options && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Poll Results</h3>
              <div className="space-y-3">
                {discussion.options.map((option, index) => {
                  const responses = Object.values(discussion.pollResponses || {});
                  const optionCount = responses.filter(r => r === option).length;
                  const percentage = responses.length > 0 ? (optionCount / responses.length) * 100 : 0;
                  const userSelected = discussion.pollResponses?.[currentUser.id] === option;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${userSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                          {option} {userSelected && '(Your choice)'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {optionCount} votes ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            userSelected ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Total responses: {Object.keys(discussion.pollResponses || {}).length}
              </p>
            </div>
          )}

          {/* Reactions */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Reactions</h3>
            <div className="flex items-center space-x-3">
              {['👍', '❤️', '😊', '🎉'].map(reaction => (
                <button
                  key={reaction}
                  onClick={() => onReaction(discussion.id, reaction)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm transition-colors ${
                    getUserReaction(discussion.reactions) === reaction
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'hover:bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{reaction}</span>
                  <span className="font-medium">{getReactionCount(discussion.reactions, reaction)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({discussion.comments.length})
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {discussion.comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                discussion.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {comment.employeeId.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.employeeId}</span>
                        <span className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailModal;