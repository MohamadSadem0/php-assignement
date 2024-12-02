import React, { useState } from 'react';
import { getDecryptedItem } from '../../utils/decryptToken';
import EditProductForm from '../forms/EditProductForm';
import axiosInstance from '../../utils/axiosInstance';

const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
  const role = getDecryptedItem('encryptedRole');
  // const [role, setRole] = useState(getDecryptedItem('encryptedRole'));

  const handleSave = (updatedProduct) => {
    onEdit(updatedProduct);
    setEditModalOpen(false);
  };

  const handleDelete = async() => {
    const ressponse = await axiosInstance.delete(` `)
  }

  return (
    <div className="relative w-[300px] bg-gradient-to-br from-slate-900 to-black shadow-lg rounded-xl flex-shrink-0 p-6 border border-slate-800 transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:border-blue-600">
      <div className="flex justify-center mb-4">
        <div className="relative h-[100px] w-[100px] rounded-full bg-slate-800 flex items-center justify-center border-2 border-gray-500 shadow-lg">
          <img
            src={imageUrl}
            alt={name}
            className="h-[90px] w-[90px] rounded-full object-cover"
          />
        </div>
      </div>
      <div className="text-center text-white space-y-2">
        <h2 className="text-xl font-bold tracking-wide">{name}</h2>
        <p className="text-sm font-semibold text-gray-300">{formattedPrice}</p>
      </div>
      <div className="mt-4 bg-gray-800 bg-opacity-90 p-3 rounded-md shadow-inner text-xs text-gray-200 break-words font-mono transform transition-transform duration-300 hover:-translate-y-1">
        <span className="font-semibold">Description: {description}</span>
      </div>
      {role === 'admin' && (
        <div className="mt-4">
          <div className="flex justify-between space-x-4">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-transform transform hover:-translate-y-1 active:translate-y-1 shadow-md"
              aria-label={`Edit ${name}`}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-transform transform hover:-translate-y-1 active:translate-y-1 shadow-md"
              aria-label={`Delete ${name}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={onAddToCart}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:translate-y-1 active:translate-y-2 shadow-md"
          aria-label={`Add ${name} to cart`}
        >
          Add to Cart
        </button>
      </div>

      <EditProductForm
        product={{ id, name, description, price, imageUrl }}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductCard;
