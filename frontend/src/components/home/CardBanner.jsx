import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import { FaShieldVirus, FaTemperatureHigh, FaKitMedical } from 'react-icons/fa6';

const CardBanner = () => {
  return (
    <section className="py-12 bg-bgColor">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Banner 1 - Vitamins & Zinc */}
          <Link
            to="/shop?category=vitamins-supplements"
            className="p-8 bg-[url('/images/banner-vitamins.jpg')] bg-no-repeat bg-cover bg-center rounded-3xl flex flex-col justify-between min-h-[240px] shadow-xs hover:shadow-xl transition-all duration-300 group border border-border relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-primaryDark text-white px-2.5 py-1 rounded-md shadow-2xs">
                <FaShieldVirus className="text-accent text-xs" /> Immunity Care
              </span>
              <h3 className="text-xl md:text-2xl font-black text-heading my-2 group-hover:text-primary transition-colors leading-tight">
                Multivitamins & <br /> Zinc Complex
              </h3>
              <p className="text-xs text-text font-medium max-w-[190px]">
                High-potency immune support & vital daily energy defense.
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                Shop Vitamins →
              </span>
            </div>
          </Link>

          {/* Health Banner 2 - Digital Thermometers & Diagnostics */}
          <Link
            to="/shop?category=medical-devices"
            className="p-8 bg-[url('/images/banner-thermometer.jpg')] bg-no-repeat bg-cover bg-center rounded-3xl flex flex-col justify-between min-h-[240px] shadow-xs hover:shadow-xl transition-all duration-300 group border border-border relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-teal-700 text-white px-2.5 py-1 rounded-md shadow-2xs mb-2">
                <FaTemperatureHigh className="text-teal-200 text-xs" /> Clinical Devices
              </span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl md:text-3xl font-black text-coral">$24.99</span>
                <span className="text-xs md:text-sm line-through text-text/60 font-medium">$39.99</span>
              </div>
              <h3 className="text-base md:text-lg font-bold uppercase text-heading group-hover:text-primary transition-colors">
                Digital Infrared <br /> Thermometers
              </h3>
              <p className="text-xs text-text font-medium mt-1 max-w-[170px]">
                Instant 1-second touchless fever readout.
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                View Devices →
              </span>
            </div>
          </Link>

          {/* Health Banner 3 - First Aid Emergency Kit */}
          <Link
            to="/shop?category=first-aid"
            className="p-8 bg-[url('/images/banner-firstaid.jpg')] bg-no-repeat bg-cover bg-center rounded-3xl flex flex-col justify-between min-h-[240px] shadow-xs hover:shadow-xl transition-all duration-300 group border border-border relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-coral text-white px-2.5 py-1 rounded-md shadow-2xs">
                <FaKitMedical className="text-white text-xs" /> Emergency First Aid
              </span>
              <h3 className="text-xl md:text-2xl font-black text-heading my-1 group-hover:text-coral transition-colors leading-tight">
                120-Piece Medical Kit
              </h3>
              <p className="text-xs font-medium text-text max-w-[180px]">
                Sterile dressings, antiseptic wipes & burn emergency care.
              </p>
            </div>
            <div className="relative z-10 mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-text uppercase font-semibold">Only</span>
                <span className="text-heading text-2xl font-black">$19.99</span>
              </div>
              <span className="text-xs font-bold text-coral group-hover:underline inline-flex items-center gap-1">
                Shop First Aid →
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default CardBanner;
