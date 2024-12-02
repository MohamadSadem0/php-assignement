import axios from 'axios';
import { useState } from 'react';

const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sv66trey'); // Use the unsigned preset

    try {
      setLoading(true);
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlupbtvqe/image/upload', // Ensure the cloud_name is correct
        formData
      ); 
      setImageUrl(response.data.secure_url);
      setLoading(false);
      return response.data.secure_url; 
    } catch (err) {
      setError(
        err.response ? err.response.data.error.message : 'Upload failed'
      );
      setLoading(false);
      throw err;
    }
  };

  return { uploadImage, imageUrl, loading, error };
};

export default useCloudinaryUpload;
//OCjUvti_vrfvA6Eq6J7ALYlctY4