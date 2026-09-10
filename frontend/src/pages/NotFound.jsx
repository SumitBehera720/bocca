import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';

const NotFound = () => {
  return (
    <div className="py-24 bg-gray-50/50 min-h-[70vh] flex items-center">
      <Container className="text-center">
        <h1 className="text-7xl font-extrabold text-primery mb-4">404</h1>
        <h2 className="text-2xl font-bold text-heading mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="bg-primery hover:bg-[#e09f1b] text-heading font-bold px-8 py-3 rounded-lg text-sm shadow transition-colors inline-block"
        >
          Return to Homepage
        </Link>
      </Container>
    </div>
  );
};

export default NotFound;
