import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPrescription } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import ProductQuickViewModal from './ProductQuickViewModal';

const ProductCard = ({ products, fit = false }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!products) return null;

  const id = products.id;
  const productName = products.productName || products.name || products.title || 'Healthcare Product';
  const image = products.image || '/images/paracetamol.jpg';
  const packSize = products.packSize || products.pack_size || products.weight || 'Standard Pack';
  const weight = products.weight;
  const brand = products.brand || products.brandName || products.brand_name || products.manufacturer || 'Certified Pharma';
  const manufacturer = products.manufacturer;
  const price = products.price || 0;
  const oldPrice = products.oldPrice || products.old_price || 0;
  const requiresPrescription = products.requiresPrescription || products.requires_prescription;
  const reviews = products.reviews || [];

  const isFavorite = isInWishlist(id);
  const hasDiscount = oldPrice > 0 && oldPrice > price;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const isRx = requiresPrescription === 1 || requiresPrescription === true;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '5.0';

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i) {
        stars.push(<FaStar key={i} className="text-amber-400 text-xs" />);
      } else if (numRating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-amber-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-xs" />);
      }
    }
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, 1, productName);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id, productName);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="relative group bg-white border border-border rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-accent flex flex-col justify-between h-full min-h-[390px]">
        {/* Badges: Rx Required & Discount */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isRx && (
            <span className="bg-primaryDark text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <FaPrescription className="text-xs text-accent" /> Rx Required
            </span>
          )}
          {hasDiscount && (
            <span className="bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleOpenQuickView}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-text hover:text-primary hover:bg-primaryLight transition-colors"
            title="Quick View Medicine"
          >
            <BsArrowsFullscreen className="text-xs" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              isFavorite ? 'text-coral' : 'text-text hover:text-coral'
            }`}
            title="Add to Wishlist"
          >
            {isFavorite ? <IoHeart className="text-sm text-coral" /> : <IoHeartOutline className="text-sm" />}
          </button>
        </div>

        {/* Medicine Product Image */}
        <Link to={`/product/${id}`} className="block overflow-hidden rounded-xl mb-3 flex items-center justify-center h-48 bg-bgColor/80 p-3">
          <img
            src={image}
            alt={productName}
            className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Medicine Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-0.5">
              {brand || manufacturer || 'Certified Pharma'}
            </span>

            <Link to={`/product/${id}`} className="block">
              <h3 className="text-sm font-bold text-heading hover:text-primary transition-colors line-clamp-2 mb-1" title={productName}>
                {productName}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 my-1">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-xs text-text font-medium">({reviews.length || 1})</span>
            </div>

            <p className="text-xs text-text font-medium">
              Pack: <span className="text-heading font-semibold">{packSize || weight || 'Standard Pack'}</span>
            </p>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-extrabold ${hasDiscount ? 'text-coral' : 'text-primaryDark'}`}>
                ${price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-text/60 line-through">
                  ${oldPrice}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primaryDark text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={products}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
