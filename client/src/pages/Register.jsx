import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ setCurrentPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', { name, email, password });
    setCurrentPage('login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Buat Akun Baru
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Isi data di bawah untuk memulai
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Alamat Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="anda@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Daftar
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <button onClick={() => setCurrentPage('login')} className="font-medium text-indigo-600 hover:text-indigo-500">
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;