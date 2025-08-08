import React from 'react';
import { Ticket } from 'lucide-react';
import Avatar from './Avatar';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const TicketList = ({ tickets }) => {
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
            <div key={ticket._id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar name={ticket.reporter.avatar} className="w-12 h-12" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {ticket.title}
                    </h3>
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Pelapor: {ticket.reporter.name}</span>
                    <span>Kategori: {ticket.category}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;