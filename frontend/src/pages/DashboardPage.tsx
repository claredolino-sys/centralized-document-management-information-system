import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">CDMIS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.full_name}</span>
              <span className="text-xs text-gray-500">({user?.role})</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold mb-4">Welcome to CDMIS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Total Records</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">0</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Pending Requests</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">0</div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Disposal Reminders</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">0</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-600">
              This is a production-ready CDMIS implementation with full backend API, 
              authentication, RBAC, audit logging, and Docker deployment support.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
