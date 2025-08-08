import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Search, Bell, Settings, LogOut, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketList from '../components/TicketList';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

// Mock data
const sampleTickets = [
  // ... (copy mock data array here)
];

const Dashboard = () => {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get('/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = (newTicketFromServer) => {
    setTickets([newTicketFromServer, ...tickets]);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TicketSys</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600">Total Tiket</p>
                   <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                 </div>
                 <div className="p-3 bg-blue-100 rounded-xl">
                   <Ticket className="w-6 h-6 text-blue-600" />
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600">Open</p>
                   <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                 </div>
                 <div className="p-3 bg-blue-100 rounded-xl">
                   <AlertCircle className="w-6 h-6 text-blue-600" />
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600">In Progress</p>
                   <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                 </div>
                 <div className="p-3 bg-purple-100 rounded-xl">
                   <Clock className="w-6 h-6 text-purple-600" />
                 </div>
               </div>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600">Closed</p>
                   <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
                 </div>
                 <div className="p-3 bg-green-100 rounded-xl">
                   <CheckCircle className="w-6 h-6 text-green-600" />
                 </div>
               </div>
             </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari tiket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">Semua Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            Buat Tiket
          </button>
        </div>

        {/* Daftar Tiket */}
        {error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <TicketList tickets={filteredTickets} />
        )}
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
};

export default Dashboard;