import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import Paragraph from '../common/Paragraph';
import { FaShieldHalved, FaHeartPulse } from 'react-icons/fa6';
import { FaFilePrescription } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="py-8 bg-bgColor">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Large Pharmacy Hero Banner */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[url('/images/hero-pharmacy-main.jpg')] bg-no-repeat bg-cover bg-right md:bg-center rounded-3xl p-8 md:p-12 min-h-[400px] shadow-xs relative overflow-hidden border border-border">
            <div className="max-w-lg relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-primaryDark text-white text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full mb-3.5 tracking-wider shadow-xs">
                <FaShieldHalved className="text-accent text-xs" /> Certified Online Pharmacy
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-heading leading-[1.15] mb-3.5">
                Genuine Medicines & Healthcare Essentials
              </h1>
              <Paragraph
                pera="Verified prescription medications, OTC pain relief, immunity vitamins, and diagnostic devices delivered with certified safety."
                style="text-heading font-medium text-sm md:text-base mb-6 max-w-md"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10">
              <Link
                to="/shop"
                className="inline-block bg-primary hover:bg-primaryDark text-white font-bold text-sm md:text-base px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-98"
              >
                Shop All Medicines →
              </Link>
              <Link
                to="/upload-prescription"
                className="inline-flex items-center gap-2 bg-white hover:bg-primaryLight text-primary font-bold text-sm md:text-base px-5 py-3.5 rounded-xl shadow-xs transition-all duration-200 border border-border active:scale-98"
              >
                <FaFilePrescription className="text-primary text-base" /> Upload Prescription
              </Link>
            </div>
          </div>

          {/* Secondary Pharmacy Promo Banner */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[url('/images/hero-wellness-promo.jpg')] bg-no-repeat bg-cover bg-center rounded-3xl p-8 min-h-[400px] shadow-xs border border-border relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-coral bg-white/90 px-2.5 py-1 rounded-md shadow-2xs">
                <FaHeartPulse className="text-xs" /> Special Patient Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-heading my-2">
                20% OFF
              </h2>
              <Paragraph
                pera="Daily Vitamin C, Zinc & Immunity Boosters"
                style="text-heading font-bold text-base md:text-lg max-w-[210px] leading-snug"
              />
            </div>

            <div className="relative z-10 mt-6">
              <Link
                to="/shop?category=vitamins-supplements"
                className="inline-block bg-white hover:bg-primary hover:text-white text-heading font-bold text-sm px-5 py-3 rounded-xl shadow-xs transition-all duration-200 border border-border active:scale-98"
              >
                View Wellness Deals →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
