import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost/assignements/php-assignement-test/action/reset-password-handler.php`,
        {
          email: email,
          password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setMessage(data.message || 'Password reset successfully.');
        setLoading(false);
        setNavigating(true);
        setTimeout(() => {
          navigate('/signin');
          setNavigating(false);
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setLoading(false);
    }
  };

  if (navigating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-300">
      <h1 className="text-2xl font-bold text-white text-center mb-4">
        Reset Password
      </h1>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
        {message && (
          <p className="text-green-400 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Remembered your password?{' '}
        <Link
          to="/signin"
          className="text-blue-400 font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
