import React, { useState } from 'react';
import { FaFacebookF, FaGithub, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { encryptItem } from '../../utils/encryptionItem';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(`login-handler.php`, {
        email,
        password,
      });

      const data = response.data;
      if (data && data.success) {
        encryptItem(email, 'email');
        encryptItem(data.role, 'role');
        data.role === 'admin' ? navigate('/dash') : navigate('/user-info');
      } else {
        setError(data.message || 'Invalid login credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-300">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Sign In
      </h1>
      <div className="flex justify-center space-x-4 mb-6">
        <button className="hover:bg-gray-600 text-xl p-3 rounded-full shadow-sm hover:shadow transition">
          <FaGoogle className="text-red-500" />
        </button>
        <button className="hover:bg-gray-600 text-xl p-3 rounded-full shadow-sm hover:shadow transition">
          <FaFacebookF className="text-blue-500" />
        </button>
        <button className="hover:bg-gray-600 text-xl p-3 rounded-full shadow-sm hover:shadow transition">
          <FaGithub className="text-gray-400" />
        </button>
        <button className="hover:bg-gray-600 text-xl p-3 rounded-full shadow-sm hover:shadow transition">
          <FaLinkedinIn className="text-blue-400" />
        </button>
      </div>
      <p className="text-gray-400 text-center mb-4">
        Or sign in with your email
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div className="text-right">
          <Link
            to="/reset-password"
            className="text-blue-400 font-medium hover:underline"
          >
            Forgot Your Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-blue-400 font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
