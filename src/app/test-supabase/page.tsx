'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus('✅ Connected to Supabase successfully!');
      } catch (error) {
        setStatus(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
        <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
}
