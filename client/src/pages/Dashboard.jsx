import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Search, Bell, Settings, LogOut, AlertCircle, CheckCircle, Clock, ShieldCheck, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketList from '../components/TicketList';
import toast from 'react-hot-toast';

const Dashboard = ({ onNavigateToAdmin }) => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Efek untuk mengambil data tiket saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/tickets');
        setTickets(response.data);
      } catch (err) {
        toast.error('Tidak dapat memuat data tiket.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Fungsi yang dipanggil setelah tiket baru berhasil dibuat di server
  const handleCreateTicket = (newTicketFromServer) => {
    setTickets([newTicketFromServer, ...tickets]);
  };

  // Fungsi untuk memperbarui UI setelah status/assignee tiket diubah
  const handleTicketUpdate = (updatedTicket) => {
    setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
  };

  // Logika untuk memfilter tiket berdasarkan pencarian dan status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Menghitung statistik untuk ditampilkan di kartu
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    done: tickets.filter(t => t.status === 'done').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  // Tampilan loading
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
              <h1 className="text-xl font-bold text-gray-900">TicketSys Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {user && user.role === 'admin' && (
                <button
                  onClick={onNavigateToAdmin}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ShieldCheck size={20} />
                  Admin Panel
                </button>
              )}
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
      
      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600">Total Tickets</p>
                   <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                 </div>
                 <div className="p-3 bg-gray-100 rounded-xl">
                   <Ticket className="w-6 h-6 text-gray-600" />
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
                   <p className="text-sm text-gray-600">Done</p>
                   <p className="text-2xl font-bold text-amber-600">{stats.done}</p>
                 </div>
                 <div className="p-3 bg-amber-100 rounded-xl">
                   <FileCheck className="w-6 h-6 text-amber-600" />
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

        {/* Kontrol (Pencarian, Filter, Tombol Buat) */}
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
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            Buat Tiket Baru
          </button>
        </div>

        {/* Daftar Tiket */}
        <TicketList tickets={filteredTickets} onTicketUpdate={handleTicketUpdate} />
      </main>

      {/* Modal untuk Membuat Tiket */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
};

export default Dashboard;