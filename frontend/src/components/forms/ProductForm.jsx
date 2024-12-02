import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';
import axiosInstance from '../../utils/axiosInstance';
import { getDecryptedItem } from '../../utils/decryptToken';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    uploadImage,
    imageUrl,
    loading: imageLoading,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(`add-products.php`, {
        name: name,
        description: description,
        price: price,
        image_path: imageUrl,
        email: getDecryptedItem('encryptedEmail'),
        role: getDecryptedItem('encryptedRole'),
      });
      const data = response.data;
      if (data && data.success) {
        navigate('/product-info');
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (error) {
      setError('An error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-300 mx-auto">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Add Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Description"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            $
          </span>
          <input
            type="number"
            placeholder="Price"
            className="w-full pl-8 pr-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            required
          />
        </div>

        <div>
          <input
            type="file"
            className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onChange={handleImageChange}
          />
          {imageLoading && (
            <p className="text-gray-400 mt-2 text-center">Uploading...</p>
          )}
          {uploadError && (
            <p className="text-red-400 mt-2 text-sm">{uploadError}</p>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition disabled:opacity-50"
          disabled={loading || imageLoading}
        >
          {loading || imageLoading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
