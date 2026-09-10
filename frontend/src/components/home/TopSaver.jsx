import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import ProductCard from '../product/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getProducts } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

const TopSaver = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  useEffect(() => {
    const loadTopSavers = async () => {
      try {
        const data = await getProducts({ isTopSaver: true });
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to load top saver products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTopSavers();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.username || !regForm.email || !regForm.password) return;
    setSubmitting(true);
    const success = await register(regForm.username, regForm.email, regForm.password);
    if (success) {
      setRegForm({ username: '', email: '', password: '' });
    }
    setSubmitting(false);
  };

  return (
    <section className="my-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Top Healthcare Deals Slider */}
          <div className="lg:col-span-8">
            <SectionTitle
              title="Daily Healthcare Deals & Top Savers"
              lable="All Health Offers"
              link="/shop?isTopSaver=true"
            />

            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-border h-80 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={16}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    480: { slidesPerView: 2, spaceBetween: 16 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                  }}
                  modules={[Pagination]}
                  className="pb-12"
                >
                  {products.map((item) => (
                    <SwiperSlide key={item.id} className="h-auto">
                      <ProductCard products={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* 15% OFF Patient Sign Up Card */}
          <div className="lg:col-span-4 bg-[url('/images/homepage-new-contact-form-bg.png')] bg-no-repeat bg-center bg-cover rounded-3xl p-8 shadow-sm border border-border">
            <div className="text-center mb-6">
              <span className="text-4xl md:text-5xl font-black text-coral block mb-1">
                15% OFF
              </span>
              <p className="text-base font-bold text-heading">
                For new patient account registration on first prescription order
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Full Patient Name"
                value={regForm.username}
                onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                className="w-full text-xs bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-heading"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                className="w-full text-xs bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-heading"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full text-xs bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-heading"
              />
              
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full bg-primary hover:bg-primaryDark text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-xs active:scale-98"
              >
                {submitting ? 'Registering Patient...' : 'Register for 15% OFF'}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TopSaver;
