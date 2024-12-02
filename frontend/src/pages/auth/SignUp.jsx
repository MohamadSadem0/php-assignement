import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    uploadImage,
    imageUrl,
    loading,
    error: uploadError,
  } = useCloudinaryUpload();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadImage(file);
      } catch (err) {
        setError('Image upload failed');
      }
    }
  };

  const handleSignUp = async (ev) => {
    ev.preventDefault();

    if (!imageUrl) {
      setError('Please upload an image first');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/assignements/php-assignement-test/action/register-handler.php',
        {
          name: name,
          email: email,
          password: password,
          image_path: imageUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      console.log(response);

      if (data.success) {
        navigate('/login');
      } else {
        setError(data.error);
        console.log(data.error);
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || 'An error occurred on the server.'
        );
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="bg-gray-700 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-300">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Create Account
      </h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="file"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={handleImageChange}
            disabled={loading}
            required
          />
        </div>
        {imageUrl && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 mb-2">Uploaded Image:</p>
            <img
              src={imageUrl}
              alt="Uploaded Preview"
              className="w-28 h-28 mx-auto rounded-lg object-cover"
            />
          </div>
        )}
        {uploadError && (
          <p className="text-red-400 text-sm text-center">{uploadError}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Sign Up'}
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </form>
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
