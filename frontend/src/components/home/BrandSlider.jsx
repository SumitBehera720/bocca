import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { getBrands } from '../../services/productService';

const BrandSlider = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data || []);
      } catch (error) {
        console.error('Failed to load pharma brands:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  return (
    <section className="mt-14">
      <Container>
        <SectionTitle
          title="Featured Pharmaceutical Brands"
          lable="View All Brands"
          link="/shop"
        />

        <div className="mt-8">
          {loading ? (
            <div className="flex gap-4 overflow-hidden py-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 bg-white border border-border h-60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <Swiper
              slidesPerView={1}
              spaceBetween={16}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              modules={[Pagination, Autoplay]}
              className="pb-12"
            >
              {brands.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link
                    to={`/shop?brand=${encodeURIComponent(item.brandName || item.brand_name || '')}`}
                    className="block group bg-white border border-border hover:border-accent rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 p-5 text-left h-full"
                  >
                    <div className="h-40 flex items-center justify-center bg-white rounded-xl overflow-hidden mb-4 p-2 border border-border shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.brandName || item.brand_name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-xs uppercase font-extrabold text-accent tracking-wider block mb-1">
                      {item.brandName || item.brand_name}
                    </span>
                    <h3 className="text-sm font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </Container>
    </section>
  );
};

export default BrandSlider;
