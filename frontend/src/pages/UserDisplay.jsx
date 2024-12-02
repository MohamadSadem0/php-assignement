import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UserCard from '../components/cards/UserCard';

const UserDisplay = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'http://localhost/assignements/php-assignement-test/action/fetch-users.php',
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError('Failed to fetch user: ' + response.data.error);
        }
      } catch (error) {
        setError('Error fetching user: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading user...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="flex justify-center items-center p-6">
      {user ? (
        <UserCard
          username={user.name}
          id={user.id}
          email={user.email}
          password={user.password}
          imageUrl={user.image_path}
          date={user.date}
        />
      ) : (
        <div className="text-center mt-10">User not found.</div>
      )}
    </div>
  );
};

export default UserDisplay;
