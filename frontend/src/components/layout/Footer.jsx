import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import Paragraph from '../common/Paragraph';
import { FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import { FaPrescriptionBottleAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import { subscribeNewsletter } from '../../services/authService';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const footerInfo = [
    {
      icon: '/icon/f_1.png',
      title: 'Free Express Delivery',
      desc: 'On medicine orders over $200'
    },
    {
      icon: '/icon/f_2.png',
      title: '100% Genuine Medicines',
      desc: 'Direct from licensed manufacturers'
    },
    {
      icon: '/icon/f_3.png',
      title: '100% Secure Checkout',
      desc: 'HIPAA & PCI compliant payments'
    },
    {
      icon: '/icon/f_4.png',
      title: '24/7 Pharmacist Support',
      desc: 'Licensed medical guidance'
    },
    {
      icon: '/icon/f_5.png',
      title: 'Daily Wellness Deals',
      desc: 'Save up to 40% on healthcare'
    },
  ];

  const usefulLinks = [
    { label: 'About Pharmart', link: '/about' },
    { label: 'Shop All Medicines', link: '/shop' },
    { label: 'Prescription Drugs (Rx)', link: '/shop?category=prescription-medicines' },
    { label: 'OTC Pain & Fever', link: '/shop?category=otc-medicines' },
    { label: 'Vitamins & Immunity', link: '/shop?category=vitamins-supplements' },
    { label: 'Privacy & Health Policy', link: '/privacy' },
  ];

  const helpCenter = [
    { label: 'Prescription Upload Guide', link: '/help/prescription' },
    { label: 'Medicine Delivery Info', link: '/help/delivery' },
    { label: 'Return & Refund Policy', link: '/help/returns' },
    { label: 'Pharmacy FAQs', link: '/help/faq' },
    { label: 'Consult a Pharmacist', link: '/help/consult' },
  ];

  const pharmartBusiness = [
    { label: 'Partner with Pharmart', link: '/business/partner' },
    { label: 'Hospital & Clinic Supply', link: '/business/clinics' },
    { label: 'Corporate Wellness Plans', link: '/business/corporate' },
    { label: 'Pharmacy Careers', link: '/business/careers' },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setSubscribing(true);
      const res = await subscribeNewsletter(email);
      toast.success(res.message || 'Subscribed to pharmacy health updates!');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-auto bg-white border-t border-border">
      {/* Footer Top Info Badges */}
      <div className="py-8 border-b border-border bg-bgColor">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {footerInfo.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-border shadow-xs">
                <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-heading">{item.title}</h3>
                  <p className="text-xs text-text font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Store Information */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💊</span>
                <h3 className="text-heading font-extrabold text-xl">Pharmart Online Pharmacy</h3>
              </div>
              <Paragraph pera="Pharmart is your accredited digital pharmacy for certified prescription medications, OTC remedies, vitamins, medical diagnostic devices, and professional healthcare consultations." />
              
              <div className="mt-6 flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <FiPhone className="text-lg text-primary shrink-0" />
                  <div>
                    <span className="text-xs text-text block">Pharmacy Helpline 24/7:</span>
                    <a href="tel:1800PHARMART" className="text-xl font-bold text-heading hover:text-primary duration-200">
                      1-800-PHARMART
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMapPin className="text-lg text-primary shrink-0" />
                  <span className="text-sm text-text">959 Medical Center Blvd, Eastlake, NYC</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="text-lg text-primary shrink-0" />
                  <a href="mailto:support@pharmart.com" className="text-sm text-text hover:text-primary duration-200">
                    rx-support@pharmart.com
                  </a>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="lg:col-span-2">
              <h3 className="text-heading font-bold text-base mb-4">Medicines & Care</h3>
              <ul className="flex flex-col gap-2.5">
                {usefulLinks.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-sm text-text hover:text-primary duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Center */}
            <div className="lg:col-span-2">
              <h3 className="text-heading font-bold text-base mb-4">Patient Support</h3>
              <ul className="flex flex-col gap-2.5">
                {helpCenter.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-sm text-text hover:text-primary duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pharmart Business */}
            <div className="lg:col-span-2">
              <h3 className="text-heading font-bold text-base mb-4">Healthcare Partners</h3>
              <ul className="flex flex-col gap-2.5">
                {pharmartBusiness.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-sm text-text hover:text-primary duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Health Newsletter */}
            <div className="lg:col-span-2">
              <h3 className="text-heading font-bold text-base mb-4">Health Advisory</h3>
              <Paragraph pera="Subscribe for medical updates, seasonal health tips, and exclusive prescription discounts." />
              
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Patient Email Address..."
                  className="text-xs font-medium text-heading py-2.5 px-3 bg-white border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="text-xs font-bold text-white bg-primary hover:bg-primaryDark transition-colors py-2.5 rounded-xl shadow-xs"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright */}
      <div className="py-6 bg-bgColor border-t border-border">
        <Container>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-xs text-text">
              © {new Date().getFullYear()} <strong className="text-heading font-bold">Pharmart Healthcare Inc.</strong> All pharmaceutical products dispensed by licensed pharmacists.
            </p>
            <img src="/images/footer-new-payment.png" alt="Payment & Security" className="h-6 object-contain" />
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
