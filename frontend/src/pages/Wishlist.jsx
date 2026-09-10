import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { IoTrashOutline } from 'react-icons/io5';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <Container className="py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-border shadow-xs">
          <div className="w-16 h-16 bg-red-50 text-coral rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ❤️
          </div>
          <h2 className="text-2xl font-bold text-heading mb-2">Your Pharmacy Wishlist is Empty</h2>
          <p className="text-sm text-text mb-6">Save essential medicines, wellness supplements, and medical devices to purchase anytime.</p>
          <Link
            to="/shop"
            className="bg-primary hover:bg-primaryDark text-white font-bold px-6 py-3 rounded-xl text-sm inline-block shadow-xs transition-colors"
          >
            Explore Medicines & Health Store
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-10 bg-bgColor min-h-screen">
      <Container>
        <h1 className="text-3xl font-extrabold text-heading mb-8">
          My Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="divide-y divide-border">
            {wishlistItems.map((item) => (
              <div key={item.wishlistId} className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-contain rounded-xl bg-bgColor p-2 shrink-0 border border-border"
                  />
                  <div>
                    <Link to={`/product/${item.productId}`} className="text-base font-bold text-heading hover:text-primary transition-colors">
                      {item.productName}
                    </Link>
                    <p className="text-xs text-text">{item.weight} • {item.brand}</p>
                    <span className="text-sm font-bold text-coral block mt-1">
                      ${item.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      addToCart(item.productId, 1, item.productName);
                      removeFromWishlist(item.wishlistId);
                    }}
                    className="bg-primary hover:bg-primaryDark text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item.wishlistId)}
                    className="text-text/60 hover:text-coral p-2 transition-colors"
                    title="Remove from wishlist"
                  >
                    <IoTrashOutline className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Wishlist;
