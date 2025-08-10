import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import Avatar from './Avatar';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import toast from 'react-hot-toast';

const TicketList = ({ tickets, onTicketUpdate }) => {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    // Admin perlu daftar developer untuk bisa menugaskan tiket
    if (user.role === 'admin') {
      apiClient.get('/admin/developers')
        .then(res => setDevelopers(res.data))
        .catch(() => toast.error('Gagal memuat daftar developer.'));
    }
  }, [user.role]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/status`, { status: newStatus });
      onTicketUpdate(response.data); // Kirim data terbaru ke parent (Dashboard)
      toast.success('Status tiket diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui status.');
    }
  };

  const handleAssigneeChange = async (ticketId, newAssigneeId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/assign`, { assigneeId: newAssigneeId });
      onTicketUpdate(response.data);
      toast.success('Tiket berhasil ditugaskan!');
    } catch (error) {
      toast.error('Gagal menugaskan tiket.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tidak ada tiket ditemukan</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                     <h3 className="text-lg font-semibold text-gray-900 break-words pr-4">{ticket.title}</h3>
                     <div className="flex-shrink-0 flex items-center gap-2">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                     </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Avatar name={ticket.reporter.name.substring(0, 2).toUpperCase()} className="w-6 h-6 text-xs" />
                      <span>Pelapor: <strong>{ticket.reporter.name}</strong></span>
                    </div>
                    <span>Kategori: <strong>{ticket.category}</strong></span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Actions for Admin and Developer */}
                {(user.role === 'admin' || user.role === 'developer') && (
                  <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full sm:w-auto md:w-48">
                    {user.role === 'admin' && (
                       <div>
                         <label className="text-xs text-gray-500">Tugaskan ke:</label>
                         <select
                           value={ticket.assignee?._id || ''}
                           onChange={(e) => handleAssigneeChange(ticket._id, e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                         >
                           <option value="">Pilih Developer</option>
                           {developers.map(dev => (
                             <option key={dev._id} value={dev._id}>{dev.name}</option>
                           ))}
                         </select>
                       </div>
                    )}
                     <div>
                       <label className="text-xs text-gray-500">Ubah Status:</label>
                       <select
                         value={ticket.status}
                         onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                         className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                       >
                         <option value="open">Open</option>
                         <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                         <option value="closed">Closed</option>
                       </select>
                     </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;