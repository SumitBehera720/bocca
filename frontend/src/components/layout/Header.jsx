import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from '../common/Container';
import Search from './Search';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { TfiUser } from 'react-icons/tfi';
import { BsHeart, BsSearch, BsShieldCheck } from 'react-icons/bs';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { RiFireFill, RiShoppingBag3Line } from 'react-icons/ri';
import { FaFilePrescription, FaUserMd } from 'react-icons/fa';
import { MdOutlineLocalOffer, MdOutlineDeliveryDining, MdOutlineVerified } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { getCategories } from '../../services/productService';
import { ADMIN_PATH } from '../../config/adminConfig';

const Header = () => {
  const { cartCount, cartTotal, hasPrescriptionItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories for nav:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Medicines', path: '/shop' },
    { label: 'Prescription Drugs (Rx)', path: '/shop?category=prescription-medicines', isRx: true },
    { label: 'OTC Medicines', path: '/shop?category=otc-medicines' },
    { label: 'Vitamins & Immunity', path: '/shop?category=vitamins-supplements' },
    { label: 'Medical Devices', path: '/shop?category=medical-devices' },
    { label: 'First Aid', path: '/shop?category=first-aid' },
    { label: 'Flash Sale', path: '/shop?isTopSaver=true', isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-200">
      {/* Top Healthcare Micro-Bar */}
      <div className="bg-primaryDark text-white py-1.5 px-4 text-xs font-medium border-b border-primaryDark/50">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1.5 text-accent font-bold">
                <BsShieldCheck className="text-base text-success" /> 100% Certified Pharmacy
              </span>
              <span className="hidden sm:inline text-teal-100/90">
                • Licensed Pharmacist On Call • Free Delivery Over $200 with code <strong className="text-white">PHARMART15</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-teal-100">
              <Link to="/upload-prescription" className="text-teal-200 hover:text-white font-bold transition-colors flex items-center gap-1">
                <FaFilePrescription className="text-sm text-accent" /> Upload Rx
              </Link>
              {(user?.role === 'admin' || user?.email === 'admin@farmart.com') && (
                <Link to={`${ADMIN_PATH}/dashboard`} className="text-teal-200 hover:text-white font-bold transition-colors flex items-center gap-1">
                  <FaUserMd /> Pharmacist Portal
                </Link>
              )}
              <Link to="/shop?isTopSaver=true" className="hover:text-white transition-colors hidden md:flex items-center gap-1">
                <RiFireFill className="text-coral" /> Daily Offers
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <div className="py-3.5 md:py-4 bg-white border-b border-border">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-8">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-heading hover:text-primary transition-colors rounded-lg hover:bg-primaryLight/30 focus:outline-none"
              aria-label="Open Pharmacy Menu"
            >
              <HiMenuAlt1 className="text-2xl" />
            </button>

            {/* Brand Logo with Pharmacy Icon */}
            <Link to="/" className="shrink-0 flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                💊
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-primaryDark tracking-tight leading-none">
                  Pharm<span className="text-primary">art</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text font-bold leading-tight">
                  Online Pharmacy & Health
                </span>
              </div>
            </Link>

            {/* Desktop Modern Pill Search Bar */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-2">
              <Search />
            </div>

            {/* Actions & Badges (Upload Rx, User, Wishlist, Cart) */}
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
              {/* Quick Upload Rx Button (Desktop) */}
              <Link
                to="/upload-prescription"
                className="hidden xl:flex items-center gap-1.5 bg-primaryLight text-primary hover:bg-primary hover:text-white border border-primary/20 px-3.5 py-2 rounded-full text-xs font-bold transition-all"
                title="Upload Prescription"
              >
                <FaFilePrescription className="text-base" />
                <span>Upload Rx</span>
              </Link>

              {/* Mobile Search Toggle Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 text-heading hover:text-primary transition-colors rounded-full hover:bg-primaryLight/30"
                title="Toggle Search"
              >
                <BsSearch className="text-lg" />
              </button>

              {/* User Account / Profile Widget */}
              <div className="relative group">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-primaryLight/30 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primaryLight text-primary border border-primary/30 flex items-center justify-center font-bold text-sm shadow-inner">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-[11px] text-text font-medium leading-none">Account</span>
                      <span className="text-xs font-bold text-heading truncate max-w-[90px] leading-tight">
                        {user?.username}
                      </span>
                    </div>

                    {/* Profile Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border shadow-xl rounded-xl py-2 hidden group-hover:block transition-all z-50 animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-border bg-bgColor text-xs">
                        <span className="text-text block text-[10px] uppercase font-semibold">Signed in as</span>
                        <strong className="text-heading truncate block font-bold">{user?.email}</strong>
                        {user?.role === 'admin' && (
                          <span className="bg-primaryLight text-primary text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                            Pharmacist Admin
                          </span>
                        )}
                      </div>
                      {(user?.role === 'admin' || user?.email === 'admin@farmart.com') && (
                        <Link to={`${ADMIN_PATH}/dashboard`} className="block px-4 py-2 text-sm text-primary font-bold hover:bg-primaryLight">
                          ⚙️ Pharmacy Admin Portal
                        </Link>
                      )}
                      <Link to="/orders" className="block px-4 py-2 text-sm text-heading hover:bg-primaryLight/30 hover:text-primary font-medium">
                        My Medicine Orders
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-sm text-heading hover:bg-primaryLight/30 hover:text-primary font-medium">
                        Saved Items ({wishlistCount})
                      </Link>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 font-semibold transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primaryLight/30 text-heading hover:text-primary transition-all group"
                    title="Sign In / Patient Register"
                  >
                    <div className="w-9 h-9 rounded-full bg-primaryLight/60 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                      <TfiUser className="text-base text-primary group-hover:text-white" />
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-[11px] text-text font-medium leading-none">Hello, Sign in</span>
                      <span className="text-xs font-bold text-heading leading-tight">Patient Account</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Wishlist Widget */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg hover:bg-primaryLight/30 text-heading hover:text-danger transition-all flex items-center gap-2"
                title="Saved Medicines"
              >
                <div className="relative">
                  <BsHeart className="text-2xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-coral text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-xs font-bold text-heading">Wishlist</span>
              </Link>

              {/* Cart Widget with Price & Counter Badge */}
              <Link
                to="/cart"
                className={`flex items-center gap-2.5 border px-3 md:px-4 py-2 rounded-full transition-all duration-200 shadow-sm group ${
                  hasPrescriptionItems 
                    ? 'bg-red-50 border-coral text-coral hover:bg-red-100' 
                    : 'bg-bgColor hover:bg-primaryLight/50 border-border hover:border-primary'
                }`}
                title="Pharmacy Cart"
              >
                <div className="relative flex items-center">
                  <AiOutlineShoppingCart className="text-2xl text-heading group-hover:text-primary transition-transform group-hover:scale-110 duration-200" />
                  {cartCount > 0 ? (
                    <span className="absolute -top-2 -right-2.5 bg-primary text-white font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm">
                      {cartCount}
                    </span>
                  ) : (
                    <span className="absolute -top-2 -right-2.5 bg-gray-300 text-gray-700 font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                      0
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-text font-semibold leading-none uppercase">
                    {hasPrescriptionItems ? 'Rx Cart' : 'Cart'}
                  </span>
                  <span className="text-xs font-black text-heading leading-tight">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search Expandable Bar */}
          {mobileSearchOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-border animate-fadeIn">
              <Search onSearchSubmit={() => setMobileSearchOpen(false)} />
            </div>
          )}
        </Container>
      </div>

      {/* Desktop Secondary Pharmacy Navigation Bar */}
      <nav className="hidden lg:block bg-bgColor border-b border-border">
        <Container>
          <div className="flex items-center justify-between">
            {/* Quick Links */}
            <div className="flex items-center gap-1 xl:gap-2 py-2">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path || (link.path.includes('?') && location.search === link.path.split('?')[1]);
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      link.isRx
                        ? 'text-primary bg-primaryLight hover:bg-primary hover:text-white font-bold'
                        : link.isSpecial
                        ? 'bg-coral/10 text-coral hover:bg-coral hover:text-white font-bold ml-1'
                        : isActive
                        ? 'bg-white text-primary font-bold shadow-xs border border-border'
                        : 'text-text hover:text-primary hover:bg-white'
                    }`}
                  >
                    {link.isSpecial && <RiFireFill className="text-base" />}
                    {link.isRx && <FaFilePrescription className="text-sm" />}
                    <span>{link.label}</span>
                    {link.isSpecial && (
                      <span className="bg-coral text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ml-1">
                        Sale
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Trust Assurance Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-primaryDark">
              <MdOutlineVerified className="text-base text-primary" />
              <span>Genuine Medicines • <strong>Licensed Pharmacists</strong></span>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Menu Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-slideIn">
            <div>
              <div className="p-4 bg-primaryDark text-white border-b border-primaryDark flex items-center justify-between">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <span className="text-2xl">💊</span>
                  <span className="text-xl font-bold">Pharmart</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-primary transition-colors"
                >
                  <HiX className="text-2xl" />
                </button>
              </div>

              <div className="p-4 bg-primaryLight border-b border-border">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs text-text block">Welcome,</span>
                      <strong className="text-sm font-bold text-heading">{user?.username}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text">Patient Access</span>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-primary hover:bg-primaryDark text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
                    >
                      Sign In / Join
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block mb-2 px-2">
                  Pharmacy Navigation
                </span>
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-heading hover:bg-primaryLight hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.isRx && <span className="text-[10px] bg-primaryLight text-primary px-2 py-0.5 rounded-full font-bold">Rx</span>}
                    {link.isSpecial && <span className="text-[10px] bg-red-100 text-coral px-2 py-0.5 rounded-full font-bold">Offer</span>}
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block mb-2 px-2">
                  Healthcare Services
                </span>
                <Link
                  to="/upload-prescription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary font-bold hover:bg-primaryLight rounded-lg"
                >
                  <FaFilePrescription /> Upload Doctor Prescription
                </Link>
                {(user?.role === 'admin' || user?.email === 'admin@farmart.com') && (
                  <Link
                    to={`${ADMIN_PATH}/dashboard`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-heading hover:text-primary font-medium hover:bg-primaryLight/30 rounded-lg"
                  >
                    <FaUserMd /> Pharmacist Portal
                  </Link>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-bgColor">
              <div className="text-xs text-text space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-primaryDark">
                  <BsShieldCheck className="text-success text-base" /> Licensed Pharmacy Guarantee
                </p>
                <p>24/7 Clinical Consultation Line: <strong>1-800-PHARMART</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
