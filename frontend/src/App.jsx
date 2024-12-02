import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { getDecryptedItem } from './utils/decryptToken';
import { AdminRoutes, GuestRoutes, UserRoutes } from './RoleRoute';

const App = () => {
  const [role, setRole] = useState(getDecryptedItem('encryptedRole'));

  useEffect(() => {
    const storedRole = getDecryptedItem('encryptedRole');
    if (storedRole !== role) {
      setRole(storedRole);
    }
  }, [role]);

  const renderRoutes = () => {
    switch (role) {
      case 'admin':
        return <AdminRoutes />;
      case 'user':
        return <UserRoutes />;
      default:
        return <GuestRoutes />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="flex-grow flex items-center justify-center">
       {renderRoutes()}
      </div>
    </div>
  );
};

export default App;
