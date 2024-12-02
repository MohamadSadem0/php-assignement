import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import xIcon from '../../assets/xIcon.svg';
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';
import '../../styles/App.css';
import axiosInstance from '../../utils/axiosInstance';
import { getDecryptedItem } from '../../utils/decryptToken';

const EditProductForm = ({ product, isOpen, onClose, onSave }) => {
  const [editName, setEditName] = useState(product.name);
  const [editDescription, setEditDescription] = useState(product.description);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editImage, setEditImage] = useState(product.imageUrl);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    uploadImage,
    imageUrl: newImageUrl,
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

  useEffect(() => {
    if (isOpen) {
      setEditName(product.name);
      setEditDescription(product.description);
      setEditPrice(product.price);
      setEditImage(product.imageUrl);
      setError('');
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (newImageUrl) {
      setEditImage(newImageUrl);
    }
  }, [newImageUrl]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!editName || !editDescription || !editPrice) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put('add-products.php', {
        id: product.id,
        name: editName,
        description: editDescription,
        price: editPrice,
        image_path: editImage || null,
        email: getDecryptedItem('encryptedEmail'),
        role: getDecryptedItem('encryptedRole'),
      });

      const data = response.data;

      if (data && data.success) {
        const updatedProduct = {
          id: product.id,
          name: editName,
          description: editDescription,
          price: editPrice,
          image_path: editImage || null,
        };
        onSave(updatedProduct);
        onClose();
      } else {
        setError(data.message || 'Failed to edit product.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An error occurred while editing the product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-gray-700 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-300">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Edit Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description"
              className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
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
              value={editPrice}
              onChange={(e) =>
                setEditPrice(Math.max(0, Number(e.target.value)))
              }
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

          <div className="mt-4 text-center relative">
            {editImage && (
              <>
                <img
                  src={editImage}
                  alt="Product"
                  className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow mx-auto"
                />
                <img
                  src={xIcon}
                  alt="xIcon"
                  className="absolute top-0 right-0 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setEditImage('');
                  }}
                />
              </>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition"
            disabled={loading || imageLoading}
          >
            {loading || imageLoading ? 'Submitting...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-400 text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditProductForm;
