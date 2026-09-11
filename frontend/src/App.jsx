import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SingleProduct from './pages/SingleProduct';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UploadPrescription from './pages/UploadPrescription';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { ADMIN_PATH } from './config/adminConfig';

// Helper component for secret admin root route redirection
const AdminRootRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-slate-950 py-16 text-slate-100">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-slate-400">Verifying security credentials...</p>
      </div>
    );
  }
  if (isAuthenticated && user && (user.role === 'admin' || user.email === 'admin@farmart.com')) {
    return <Navigate to={`${ADMIN_PATH}/dashboard`} replace />;
  }
  return <Navigate to={`${ADMIN_PATH}/login`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<SingleProduct />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/upload-prescription" element={<UploadPrescription />} />
                
                {/* Admin Routes (Moved from public /admin to secret ADMIN_PATH) */}
                <Route path={ADMIN_PATH} element={<AdminRootRedirect />} />
                <Route path={`${ADMIN_PATH}/login`} element={<AdminLogin />} />
                <Route 
                  path={`${ADMIN_PATH}/dashboard`} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={`${ADMIN_PATH}/*`} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Customer Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
