import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import { useCart } from '../hooks/useCart';
import { GoPlus } from 'react-icons/go';
import { PiMinus } from 'react-icons/pi';
import { IoTrashOutline } from 'react-icons/io5';
import { FaPrescription, FaFileMedical } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, hasPrescriptionItems } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 200 || cartTotal === 0 ? 0 : 15.00;
  const finalTotal = (cartTotal + shipping).toFixed(2);

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container className="py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-border shadow-xs">
          <div className="w-16 h-16 bg-primaryLight text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            💊
          </div>
          <h2 className="text-2xl font-bold text-heading mb-2">Your Medicine Cart is Empty</h2>
          <p className="text-xs text-text mb-6">Browse our certified pharmacy catalog to add prescription or OTC medications.</p>
          <Link
            to="/shop"
            className="bg-primary hover:bg-primaryDark text-white font-bold px-6 py-3 rounded-xl text-xs inline-block shadow-xs transition-colors"
          >
            Explore Pharmacy Products
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-10 bg-bgColor min-h-screen">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black text-heading">
            Pharmacy Cart ({cartItems.length} items)
          </h1>
          {hasPrescriptionItems && (
            <span className="bg-red-50 text-coral border border-coral/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <FaFileMedical /> Contains Prescription Medicines (Rx)
            </span>
          )}
        </div>

        {hasPrescriptionItems && (
          <div className="p-4 bg-primaryLight border border-primary/20 rounded-2xl text-xs text-primaryDark mb-6 flex items-center gap-3">
            <FaPrescription className="text-primary text-xl shrink-0" />
            <div>
              <strong className="block font-bold">Prescription Required Notice</strong>
              <span>One or more items in your cart require a valid prescription. You will be prompted to attach your doctor prescription during checkout.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="divide-y divide-border">
                {cartItems.map((item) => {
                  const isRx = item.requiresPrescription === 1 || item.requiresPrescription === true;
                  return (
                    <div key={item.cartItemId} className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Item Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-20 h-20 object-contain rounded-xl bg-bgColor p-2 shrink-0 border border-border"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-accent">
                              {item.brand || 'Certified Pharma'}
                            </span>
                            {isRx && (
                              <span className="text-[9px] bg-red-100 text-danger font-extrabold px-1.5 py-0.2 rounded">
                                Rx
                              </span>
                            )}
                          </div>
                          <Link to={`/product/${item.productId}`} className="text-sm font-bold text-heading hover:text-primary transition-colors line-clamp-1">
                            {item.productName}
                          </Link>
                          <p className="text-xs text-text font-medium">{item.packSize || item.weight || '1 Pack'}</p>
                          <span className="text-sm font-bold text-primaryDark sm:hidden block mt-1">
                            ${item.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <div className="flex items-center border border-border rounded-xl">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2.5 py-1.5 text-text hover:bg-bgColor transition-colors"
                          >
                            <PiMinus />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-heading">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2.5 py-1.5 text-text hover:bg-bgColor transition-colors"
                          >
                            <GoPlus />
                          </button>
                        </div>

                        <div className="text-right hidden sm:block min-w-[80px]">
                          <span className="text-sm font-bold text-heading">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-text/60 hover:text-coral p-2 transition-colors"
                          title="Remove item"
                        >
                          <IoTrashOutline className="text-lg" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
              <h3 className="text-base font-bold text-heading mb-4 pb-3 border-b border-border">
                Cart Summary
              </h3>

              <div className="space-y-3 text-xs text-text">
                <div className="flex justify-between">
                  <span>Medicines Subtotal</span>
                  <span className="font-bold text-heading">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold-Chain Express Shipping</span>
                  <span className="font-bold text-heading">
                    {shipping === 0 ? <span className="text-primary font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-text/60 italic">
                    Free shipping on orders over $200!
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between text-sm font-extrabold text-heading">
                  <span>Total Due</span>
                  <span className="text-lg text-primaryDark">${finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3.5 rounded-xl mt-6 shadow-xs transition-colors text-xs active:scale-98"
              >
                {hasPrescriptionItems ? 'Proceed & Upload Prescription →' : 'Proceed to Checkout →'}
              </button>

              <Link
                to="/shop"
                className="text-xs text-primary text-center block mt-4 hover:underline font-semibold"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
