import React, { useState, useEffect } from 'react';

// ============================================================================
// Helper Components & Mock Data
// ============================================================================

// Mock data, ini akan digantikan dengan panggilan API sungguhan
const sampleTickets = [
  { _id: 't1', title: 'Server utama tidak bisa diakses dari luar jaringan', priority: 'high', status: 'open', reporter: { name: 'Budi Santoso' }, createdAt: '2025-08-08T14:00:00Z' },
  { _id: 't2', title: 'Printer di lantai 2 tidak terdeteksi oleh komputer', priority: 'medium', status: 'in_progress', reporter: { name: 'Ana Wulandari' }, createdAt: '2025-08-07T11:30:00Z' },
  { _id: 't3', title: 'Permintaan penggantian mouse yang rusak', priority: 'low', status: 'closed', reporter: { name: 'Rahmat Hidayat' }, createdAt: '2025-08-06T09:15:00Z' },
  { _id: 't4', title: 'Aplikasi internal sering crash setelah update terakhir', priority: 'high', status: 'open', reporter: { name: 'Citra Lestari' }, createdAt: '2025-08-08T16:05:00Z' },
];

// Komponen Badge untuk Prioritas
const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${styles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
    const statusMap = {
        open: { text: 'Open', style: 'bg-blue-100 text-blue-800 border-blue-200' },
        in_progress: { text: 'In Progress', style: 'bg-purple-100 text-purple-800 border-purple-200' },
        closed: { text: 'Closed', style: 'bg-gray-200 text-gray-700 border-gray-300' },
    }
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusMap[status].style}`}>
            {statusMap[status].text}
        </span>
    );
}

// ============================================================================
// 4. Komponen TicketList (components/TicketList.jsx)
// ============================================================================
const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi pengambilan data dari API
    setTimeout(() => {
      setTickets(sampleTickets);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
        <div className="text-center py-10">
            <p className="text-gray-500">Memuat tiket...</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul Tiket
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelapor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Dibuat
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="transition-all hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {ticket.reporter.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;