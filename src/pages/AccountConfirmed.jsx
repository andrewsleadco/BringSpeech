import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

const AccountConfirmed = () => {
  useEffect(() => {
    // Parse hash params and set the session
    const { hash } = window.location;
    const query = new URLSearchParams(hash.substring(1));
    const access_token = query.get("access_token");

    if (access_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token: query.get("refresh_token")
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">✅ Your account has been confirmed!</h1>
    </div>
  );
};

export default AccountConfirmed;
