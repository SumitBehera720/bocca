import React from 'react';
import Hero from '../components/home/Hero';
import CategorySlider from '../components/home/CategorySlider';
import BrandSlider from '../components/home/BrandSlider';
import TopSaver from '../components/home/TopSaver';
import BestSeller from '../components/home/BestSeller';
import CardBanner from '../components/home/CardBanner';

const Home = () => {
  return (
    <div>
      <Hero />
      <CategorySlider />
      <BrandSlider />
      <TopSaver />
      <BestSeller />
      <CardBanner />
    </div>
  );
};

export default Home;
