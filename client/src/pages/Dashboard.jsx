import React from 'react';
import TicketList from '../components/TicketList';

const Dashboard = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Aplikasi */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-gray-800">TicketSys</span>
                </div>
                <button
                    onClick={() => setCurrentPage('login')}
                    className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                    Logout
                </button>
            </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                    Daftar Tiket
                </h1>
                <button
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Buat Tiket Baru
                </button>
            </div>
          <TicketList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;