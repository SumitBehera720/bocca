import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import ProductCard from '../product/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { getProducts } from '../../services/productService';

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const data = await getProducts({ isBestSeller: true });
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to load best seller medicines:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBestSellers();
  }, []);

  return (
    <section className="py-16 bg-bgColor">
      <Container>
        <SectionTitle
          title="Most Trusted Medicines & Health Essentials"
          lable="View All Best Sellers"
          link="/shop"
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white border border-border h-80 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <Swiper
              slidesPerView={2}
              spaceBetween={16}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 16 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
              }}
              modules={[Pagination, Autoplay]}
              className="pb-12"
            >
              {products.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <ProductCard products={item} fit={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </Container>
    </section>
  );
};

export default BestSeller;
