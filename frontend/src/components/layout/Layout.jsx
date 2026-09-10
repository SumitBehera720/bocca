import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-900 font-inter text-slate-100">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Header />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
