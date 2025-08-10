import React, { useState } from 'react';
import apiClient from '../api/axios';
import toast from 'react-hot-toast';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/admin/users', formData);
      toast.success('Pengguna baru berhasil ditambahkan!');
      onUserAdded();
      onClose();
      setFormData({ name: '', email: '', password: '', role: 'user' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tambah Pengguna Baru</h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
          </div>
          <div className="space-y-4">
            {/* Form fields... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500">
                <option value="user">User</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-6 mt-2">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;