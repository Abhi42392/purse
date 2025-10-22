"use client"
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const{setToken}=useContext(AuthContext)

  const switchMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      if (isLogin) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      } else {
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          setIsLogin(true);
          setUsername('');
          setPassword('');
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-700 shadow-2xl rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl font-semibold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-neutral-400 text-sm">
              {isLogin ? 'Login to access your crypto wallet' : 'Register to create your crypto wallet'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
                className="bg-black/60 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="bg-black/60 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 disabled:opacity-60"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="text-sm text-red-500 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2 text-center"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                className="text-sm text-green-500 border border-green-500/30 bg-green-500/10 rounded-md px-3 py-2 text-center"
                role="status"
                aria-live="polite"
              >
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-lg px-4 py-3 font-semibold text-white bg-sky-500 hover:bg-sky-600 transition disabled:bg-neutral-700 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Switch between Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={switchMode}
                disabled={loading}
                className="underline text-sky-400 hover:text-sky-300 disabled:opacity-60"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
