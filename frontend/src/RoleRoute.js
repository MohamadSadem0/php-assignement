import { Navigate, Route, Routes } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AlreadyLoggedIn from './pages/error/AlreadyLoggedIn';
import ProductDisplay from './pages/ProductDisplay';
import UserDisplay from './pages/UserDisplay';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dash" element={<AdminDashboard />} />
      <Route path="/user-info" element={<UserDisplay />} />
      <Route path="/product-info" element={<ProductDisplay />} />
      <Route
        path="/"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/*"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />
      <Route
        path="/login"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />
      <Route
        path="/register"
        element={<AlreadyLoggedIn text1={'cant register'} />}
      />
    </Routes>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/user-info" element={<UserDisplay />} />
      <Route path="/product-info" element={<ProductDisplay />} />
      <Route
        path="/"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/*"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />

      <Route
        path="/register"
        element={<AlreadyLoggedIn text1={'cant register'} />}
      />
      <Route
        path="/login"
        element={<AlreadyLoggedIn text1={'already logged in'} />}
      />
    </Routes>
  );
};

const GuestRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export { AdminRoutes, GuestRoutes, UserRoutes };
