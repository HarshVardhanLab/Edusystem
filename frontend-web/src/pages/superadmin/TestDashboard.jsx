import React from 'react';

const TestDashboard = () => {
  console.log('TestDashboard: Component rendering');
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Super Admin Test Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This is a test dashboard to verify Super Admin routing works.</p>
        <div className="mt-4 space-y-2">
          <p><strong>Current URL:</strong> {window.location.pathname}</p>
          <p><strong>User Role:</strong> {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'Not logged in'}</p>
          <p><strong>Token:</strong> {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;