import React from 'react';
import { isAuthenticated, getUserRole, getUser } from '../utils/auth';

const DebugPage = () => {
  const authenticated = isAuthenticated();
  const role = getUserRole();
  const user = getUser();

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">Debug Information</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          <p><strong>Is Authenticated:</strong> {authenticated ? 'YES' : 'NO'}</p>
          <p><strong>User Role:</strong> {role || 'None'}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Data</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-