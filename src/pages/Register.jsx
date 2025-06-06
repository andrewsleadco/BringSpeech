import React, { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://bringspeech.com/account-confirmed'
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError("This email is already registered. Please login or check your inbox for a confirmation link.");
        } else if (error.message.includes('rate limit')) {
          setError("Too many requests — please wait and try again shortly.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess('Check your email to confirm your account.');
        setCooldown(true);
        setTimeout(() => setCooldown(false), 15000); // cooldown for 15 seconds
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading || cooldown}
        >
          {loading ? 'Creating account...' : cooldown ? 'Please wait...' : 'Register'}
        </button>

        {/* Optional future: Resend link button */}
        {/* <button onClick={handleResend} disabled={!email}>Resend Confirmation Email</button> */}
      </form>
    </div>
  );
};

export default Register;
