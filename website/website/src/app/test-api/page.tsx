'use client';

import { useState, useEffect } from 'react';
import { taumailApi } from '@/config/taumail-api';

export default function TestApiPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Not tested');

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setApiStatus('Testing...');
    
    try {
      console.log('🧪 Testing API connection...');
      const data = await taumailApi.getInbox();
      
      if (data.success) {
        setEmails(data.emails || []);
        setApiStatus(`✅ Success! Found ${data.emails?.length || 0} emails`);
        console.log('✅ API test successful:', data);
      } else {
        setApiStatus('❌ API returned success: false');
        setError('API returned success: false');
      }
    } catch (err) {
      setApiStatus('❌ Connection failed');
      setError(err.message);
      console.error('❌ API test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Testing webhook...');
      const response = await fetch('http://localhost:3001/api/v2/webhook/incoming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'test-frontend@tauos.org',
          to: 'saleena@tauos.org',
          subject: 'Frontend Test Email',
          text: 'This is a test email sent from the frontend to test the webhook integration.'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Webhook test successful:', result);
        setApiStatus('✅ Webhook test successful! Check inbox for new email.');
        // Refresh emails after webhook test
        setTimeout(testApiConnection, 1000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Webhook test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">
          TauMail API Integration Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Status */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">API Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status:</span>
                <span className={`px-3 py-1 rounded text-sm ${
                  apiStatus.includes('✅') ? 'bg-green-900 text-green-300' : 
                  apiStatus.includes('❌') ? 'bg-red-900 text-red-300' : 
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {apiStatus}
                </span>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={testApiConnection}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm"
                >
                  {loading ? 'Testing...' : 'Test API'}
                </button>
                
                <button
                  onClick={testWebhook}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm"
                >
                  {loading ? 'Testing...' : 'Test Webhook'}
                </button>
              </div>
              
              {error && (
                <div className="bg-red-900 text-red-300 p-3 rounded text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Emails List */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Emails ({emails.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.length === 0 ? (
                <p className="text-gray-400">No emails found</p>
              ) : (
                emails.map((email, index) => (
                  <div key={email.id || index} className="bg-gray-800 p-3 rounded border-l-4 border-yellow-400">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-yellow-300">{email.from_email}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(email.received_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1">{email.subject}</div>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {email.body_text?.substring(0, 100)}...
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        email.is_read ? 'bg-gray-700 text-gray-300' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {email.is_read ? 'Read' : 'Unread'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
                        {email.folder_name || 'Inbox'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Configuration Info */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Express.js Backend:</strong> http://localhost:3001
            </div>
            <div>
              <strong>Next.js Frontend:</strong> http://localhost:3000
            </div>
            <div>
              <strong>API Endpoint:</strong> /api/v2/emails/inbox
            </div>
            <div>
              <strong>Webhook Endpoint:</strong> /api/v2/webhook/incoming
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
