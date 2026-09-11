import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoClose, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { GoPlus } from 'react-icons/go';
import { PiMinus } from 'react-icons/pi';
import { FaPrescription, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product);
    onClose();
  };

  const isFavorite = isInWishlist(product.id);
  const isRx = product.requiresPrescription === 1 || product.requiresPrescription === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text hover:text-heading hover:bg-primaryLight rounded-full transition-colors z-10"
        >
          <IoClose className="text-2xl" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Medicine Image & Rx Badge */}
          <div className="flex flex-col items-center justify-center bg-bgColor rounded-2xl p-6 relative">
            {isRx && (
              <span className="absolute top-3 left-3 bg-primaryDark text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                <FaPrescription className="text-xs text-accent" /> Prescription Required
              </span>
            )}
            <img
              src={product.image}
              alt={product.productName}
              className="max-h-64 w-auto object-contain"
            />
            <div className="mt-4 flex items-center gap-1 text-xs text-primaryDark font-semibold">
              <FaShieldAlt className="text-primary" /> 100% Genuine Certified Medicine
            </div>
          </div>

          {/* Medicine Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-accent font-bold">
                {product.brand || product.manufacturer || 'Certified Pharma'}
              </span>
              <h2 className="text-2xl font-bold text-heading mt-1 mb-2">
                {product.productName}
              </h2>

              <div className="flex items-center gap-3 my-3">
                <span className="text-2xl font-extrabold text-primaryDark">
                  ${product.price}
                </span>
                {product.oldPrice > 0 && (
                  <span className="text-base text-text/60 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                {product.oldPrice > 0 && (
                  <span className="text-xs bg-coral text-white px-2 py-0.5 rounded font-bold">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {isRx && (
                <div className="p-2.5 bg-primaryLight border border-primary/20 rounded-xl text-xs text-primaryDark font-medium mb-3">
                  ⚠️ <strong>Doctor Prescription (Rx) Required:</strong> You will be prompted to upload a valid prescription at checkout.
                </div>
              )}

              <p className="text-xs text-text mb-3 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              <div className="text-xs text-text space-y-1 mb-4 bg-bgColor p-3.5 rounded-xl border border-border">
                <div><span className="font-bold text-heading">Pack Size:</span> {product.packSize || product.weight}</div>
                <div><span className="font-bold text-heading">Manufacturer:</span> {product.manufacturer || 'Approved Pharmaceutical Lab'}</div>
                <div><span className="font-bold text-heading">Expiry Date:</span> {product.expiryDate || '2026-12-31'}</div>
                <div><span className="font-bold text-heading">Stock:</span> Available in Pharmacy ({product.stock || 100} units)</div>
              </div>
            </div>

            <div>
              {/* Quantity Selector & Action Buttons */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-border rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-text hover:bg-bgColor transition-colors rounded-l-xl"
                  >
                    <PiMinus />
                  </button>
                  <span className="w-10 text-center font-bold text-heading text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-text hover:bg-bgColor transition-colors rounded-r-xl"
                  >
                    <GoPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primaryDark text-white font-bold py-3 px-6 rounded-xl transition-all text-sm shadow-xs"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product.id, product.productName)}
                  className={`p-3 border rounded-xl transition-colors ${
                    isFavorite 
                      ? 'border-coral text-coral bg-coral/10' 
                      : 'border-border text-text hover:border-coral hover:text-coral'
                  }`}
                  title="Add to Wishlist"
                >
                  {isFavorite ? <IoHeart className="text-xl" /> : <IoHeartOutline className="text-xl" />}
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="text-xs font-bold text-primary hover:text-primaryDark hover:underline block text-center"
              >
                View Full Dosage & Prescription Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
