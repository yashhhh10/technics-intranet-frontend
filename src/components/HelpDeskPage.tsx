import React, { useState, useEffect } from 'react';
import { Search, Filter, HelpCircle, Plus, Clock, CheckCircle, AlertCircle, User, Building, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react';
import NewTicketModal from './NewTicketModal';
import { getCurrentUser, hasRole, authorizedFetch } from '../utils/auth';

interface Ticket {
  id: string;
  raisedBy: string;
  type: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  department: string;
  createdAt: string;
}

const HelpDeskPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const isAdmin = hasRole(currentUser, 'admin');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedFetch('http://localhost:5001/api/helpdesk');
        if (!response.ok) {
          throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array');
        }
        setTickets(data.map((ticket: any) => ({
          id: String(ticket.id ?? ticket._id ?? ''),
          raisedBy: ticket.raisedBy ?? '',
          type: ticket.type ?? '',
          description: ticket.description ?? '',
          status: ticket.status ?? 'Open',
          department: ticket.department ?? '',
          createdAt: ticket.createdAt ? ticket.createdAt.split('T')[0] : ''
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleAddTicket = async (newTicket: Omit<Ticket, 'id' | 'createdAt'>) => {
    try {
      const response = await authorizedFetch('http://localhost:5001/api/helpdesk', {
        method: 'POST',
        body: JSON.stringify(newTicket)
      });
      if (!response.ok) {
        throw new Error(`Failed to create ticket: ${response.status} ${response.statusText}`);
      }
      const created = await response.json();
      // Defensive: ensure created ticket has required fields
      const ticket: Ticket = {
        id: String(created.id ?? created._id ?? Date.now().toString()),
        raisedBy: created.raisedBy ?? newTicket.raisedBy ?? '',
        type: created.type ?? newTicket.type ?? '',
        description: created.description ?? newTicket.description ?? '',
        status: created.status ?? 'Open',
        department: created.department ?? newTicket.department ?? '',
        createdAt: created.createdAt ? created.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      };
      setTickets(prev => [ticket, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Failed to create ticket');
    }
  };

  const handleStatusUpdate = (ticketId: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const canModifyTicket = (ticket: Ticket) => {
    return ticket.raisedBy === currentUser.name || isAdmin;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical issue': return 'bg-blue-100 text-blue-800';
      case 'account access': return 'bg-purple-100 text-purple-800';
      case 'hardware request': return 'bg-orange-100 text-orange-800';
      case 'software installation': return 'bg-green-100 text-green-800';
      case 'network issue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.raisedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || ticket.status === selectedStatus;
    const matchesType = selectedType === 'All Types' || ticket.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'Open').length,
      inProgress: tickets.filter(t => t.status === 'In Progress').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length
    };
  };

  const stats = getStatusStats();
  const ticketTypes = ['All Types', 'Technical Issue', 'Account Access', 'Hardware Request', 'Software Installation', 'Network Issue'];
  const statuses = ['All Status', 'Open', 'In Progress', 'Resolved'];

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading tickets...</span>
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
            <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 bg-orange-100">
              <HelpCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Help Desk</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Submit and track your support requests</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm lg:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[140px]"
              >
                {ticketTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
              {/* Ticket Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start flex-1">
                  <div className="mr-3 mt-1">
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(ticket.type)}`}>
                        {ticket.type}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Raised by {ticket.raisedBy}
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {ticket.department}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {ticket.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
                
                {canModifyTicket(ticket) && (
                  <div className="flex items-center gap-2">
                    {ticket.status !== 'Resolved' && (
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(ticket.id, e.target.value as 'Open' | 'In Progress' | 'Resolved')}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{ticket.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredTickets.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      )}

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTicket}
      />
    </div>
  );
};

export default HelpDeskPage;