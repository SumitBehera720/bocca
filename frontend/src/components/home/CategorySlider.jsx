import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { getCategories } from '../../services/productService';
import {
  FaPrescriptionBottleMedical,
  FaCapsules,
  FaShieldHalved,
  FaHeartPulse,
  FaKitMedical,
  FaPumpSoap,
  FaBaby,
  FaStethoscope,
  FaLeaf,
  FaPills
} from 'react-icons/fa6';

const CATEGORY_META = {
  'prescription-medicines': {
    icon: FaPrescriptionBottleMedical,
    subtitle: 'Doctor Rx Drugs',
    tag: 'Certified Rx',
    bg: 'bg-primaryLight text-primary group-hover:bg-primary group-hover:text-white',
    tagColor: 'bg-primaryLight text-primaryDark'
  },
  'otc-medicines': {
    icon: FaCapsules,
    subtitle: 'Pain & Cold Relief',
    tag: 'Fast Relief',
    bg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    tagColor: 'bg-teal-100/60 text-teal-800'
  },
  'vitamins-supplements': {
    icon: FaShieldHalved,
    subtitle: 'Immunity & Energy',
    tag: 'Daily Nutrients',
    bg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    tagColor: 'bg-amber-100/60 text-amber-800'
  },
  'medical-devices': {
    icon: FaHeartPulse,
    subtitle: 'Meters & Monitors',
    tag: 'Clinical Grade',
    bg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white',
    tagColor: 'bg-rose-100/60 text-rose-800'
  },
  'first-aid': {
    icon: FaKitMedical,
    subtitle: 'Wound Care & Kits',
    tag: 'Emergency',
    bg: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
    tagColor: 'bg-red-100/60 text-red-800'
  },
  'personal-care': {
    icon: FaPumpSoap,
    subtitle: 'Derma & Skincare',
    tag: 'Derma Tested',
    bg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    tagColor: 'bg-indigo-100/60 text-indigo-800'
  },
  'baby-care': {
    icon: FaBaby,
    subtitle: 'Pediatric & Mother',
    tag: 'Gentle Care',
    bg: 'bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white',
    tagColor: 'bg-pink-100/60 text-pink-800'
  },
  'health-wellness': {
    icon: FaStethoscope,
    subtitle: 'Heart & Vitality',
    tag: 'Daily Health',
    bg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    tagColor: 'bg-emerald-100/60 text-emerald-800'
  },
  'ayurvedic-herbal': {
    icon: FaLeaf,
    subtitle: 'Holistic & Organic',
    tag: '100% Herbal',
    bg: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    tagColor: 'bg-green-100/60 text-green-800'
  }
};

const getCategoryMeta = (slug) => {
  return CATEGORY_META[slug] || {
    icon: FaPills,
    subtitle: 'Healthcare & Pharma',
    tag: 'Genuine',
    bg: 'bg-primaryLight text-primary group-hover:bg-primary group-hover:text-white',
    tagColor: 'bg-primaryLight text-primaryDark'
  };
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="mt-14">
      <Container>
        <SectionTitle
          title="Browse Healthcare Categories"
          lable="View All Categories"
          link="/shop"
        />

        <div className="mt-8">
          {loading ? (
            <div className="flex gap-4 overflow-hidden py-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-1 bg-white border border-border h-48 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <Swiper
              slidesPerView={2}
              spaceBetween={16}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 3, spaceBetween: 16 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
                1280: { slidesPerView: 6, spaceBetween: 20 },
              }}
              modules={[Pagination, Autoplay]}
              className="pb-12"
            >
              {categories.map((item) => {
                const meta = getCategoryMeta(item.slug);
                const IconComponent = meta.icon;

                return (
                  <SwiperSlide key={item.id}>
                    <Link
                      to={`/shop?category=${item.slug}`}
                      className="flex flex-col items-center justify-between p-5 bg-white hover:bg-bgColor border border-border hover:border-accent rounded-2xl transition-all duration-300 hover:shadow-md group text-center h-full min-h-[195px] relative"
                    >
                      {/* Micro Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-wide transition-colors ${meta.tagColor}`}>
                        {meta.tag}
                      </span>

                      {/* Medical Icon Circle */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-2xs ${meta.bg}`}>
                        <IconComponent className="text-2xl transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Category Title */}
                      <div className="w-full">
                        <h3 className="text-xs md:text-sm font-bold text-heading group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {item.title || item.name}
                        </h3>
                        <p className="text-[11px] font-medium text-text line-clamp-1">
                          {meta.subtitle}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CategorySlider;
