'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, authApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Shield, Edit, Trash2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManageUsersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author'
  });

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;
    try {
      const data = await userApi.getUsers(token);
      setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    if (!token) return;

    try {
      await userApi.deleteUser(userId, token);
      loadUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      alert(`Failed to delete user: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await authApi.register(createForm.name, createForm.email, createForm.password);
      // After registration, update the user's role
      const usersResponse = await userApi.getUsers(token);
      const allUsers = Array.isArray(usersResponse.users) ? usersResponse.users : Array.isArray(usersResponse) ? usersResponse : [];
      const newUser = allUsers.find((u: any) => u.email === createForm.email);
      
      if (newUser) {
        await userApi.updateRole(newUser.id, createForm.role, token);
      }
      
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'author' });
      loadUsers();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      alert(`Failed to create user: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdateRole = async () => {
    if (!token || !selectedUser || !newRole) return;

    try {
      await userApi.updateRole(selectedUser.id, newRole, token);
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      loadUsers();
    } catch (error: any) {
      console.error('Failed to update role:', error);
      alert(`Failed to update role: ${error.message || 'Unknown error'}`);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Manage Users
                  </h1>
                  <p className="text-gray-400">
                    Manage user accounts and permissions
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-soloyellow hover:bg-soloyellow-dark text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                <span>Create User</span>
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-soloyellow/20 rounded-full flex items-center justify-center">
                            <span className="text-soloyellow font-medium">
                              {userItem.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white">{userItem.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{userItem.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : userItem.role === 'editor'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {userItem.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedUser(userItem);
                              setNewRole(userItem.role);
                              setShowRoleModal(true);
                            }}
                            className="text-gray-400 hover:text-white p-1"
                            title="Change Role"
                          >
                            <Shield size={18} />
                          </button>
                          {userItem.id !== user.id && (
                            <button 
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="text-gray-400 hover:text-red-400 p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New User</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-soloyellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-soloyellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-soloyellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-soloyellow"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-soloyellow hover:bg-soloyellow-dark text-black py-2 rounded-lg font-medium transition-colors"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Change User Role</h2>
              <button 
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setNewRole('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">
                Change role for <span className="text-white font-medium">{selectedUser.name}</span>
              </p>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-soloyellow"
              >
                <option value="author">Author</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleUpdateRole}
                className="w-full bg-soloyellow hover:bg-soloyellow-dark text-black py-2 rounded-lg font-medium transition-colors"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
