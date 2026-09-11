import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/common/Container';
import Paragraph from '../components/common/Paragraph';
import { GoPlus } from 'react-icons/go';
import { PiMinus } from 'react-icons/pi';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaStar, FaPrescription, FaShieldAlt, FaInfoCircle, FaFileMedical } from 'react-icons/fa';
import { getProductById, addProductReview } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('uses'); // 'uses', 'dosage', 'reviews'
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load medicine:', err);
        toast.error('Medicine not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) {
      toast.error('Please fill in your name and comment');
      return;
    }
    try {
      setSubmittingReview(true);
      await addProductReview(id, reviewForm);
      toast.success('Thank you for your patient review!');
      setReviewForm({ userName: '', rating: 5, comment: '' });
      const updated = await getProductById(id);
      setProduct(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const guarantees = [
    {
      icon: '/icon/f_1.png',
      title: 'Free Express Delivery',
      desc: 'On medicine orders over $200'
    },
    {
      icon: '/icon/f_2.png',
      title: '100% Genuine Medicines',
      desc: 'Batch-tested & sealed by pharmacy'
    },
    {
      icon: '/icon/f_3.png',
      title: 'Temperature Controlled',
      desc: 'Safe cold-chain transport'
    }
  ];

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text font-medium">Loading medicine information...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-heading mb-4">Medicine Not Found</h2>
        <Link to="/shop" className="bg-primary hover:bg-primaryDark text-white font-bold px-6 py-2.5 rounded-xl inline-block transition-colors">
          Return to Pharmacy Catalog
        </Link>
      </Container>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const hasDiscount = product.oldPrice > 0 && product.oldPrice > product.price;
  const isRx = product.requiresPrescription === 1 || product.requiresPrescription === true;

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="py-3 bg-bgColor border-b border-border">
        <Container>
          <div className="flex items-center flex-wrap gap-2 text-xs text-text">
            <Link to="/" className="text-primary hover:underline font-medium">Home</Link>
            <span>/</span>
            <Link to="/shop" className="text-primary hover:underline font-medium">Medicines & Healthcare</Link>
            <span>/</span>
            <span className="text-heading font-semibold truncate max-w-xs">{product.productName}</span>
          </div>
        </Container>
      </div>

      {/* Main Product Section */}
      <Container className="py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Medicine Image & Verification Tag */}
          <div className="lg:col-span-4 bg-bgColor border border-border rounded-2xl p-8 flex flex-col items-center justify-center relative">
            {isRx && (
              <span className="absolute top-4 left-4 bg-primaryDark text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                <FaPrescription className="text-accent" /> Prescription Required (Rx)
              </span>
            )}
            <img
              src={product.image}
              alt={product.productName}
              className="max-h-80 w-auto object-contain my-4"
            />
            <div className="mt-4 w-full bg-white border border-primary/20 rounded-xl p-3 flex items-center gap-3">
              <FaShieldAlt className="text-primary text-2xl shrink-0" />
              <div className="text-xs">
                <strong className="text-heading block font-bold">100% Authentic Drug</strong>
                <span className="text-text">Dispensed by licensed pharmacist</span>
              </div>
            </div>
          </div>

          {/* Medicine Center Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-extrabold text-accent tracking-wider">
                  {product.brand || 'Certified Pharma'}
                </span>
                {isRx ? (
                  <span className="text-[10px] bg-red-100 text-danger font-bold px-2 py-0.5 rounded">
                    Rx Medicine
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-success font-bold px-2 py-0.5 rounded">
                    OTC Product
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-heading mb-3">
                {product.productName}
              </h1>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-primaryDark">
                  ${product.price}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-text/60 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs bg-coral text-white px-2.5 py-0.5 rounded-md font-bold">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {isRx && (
                <div className="p-3.5 bg-primaryLight border border-primary/20 rounded-xl text-xs text-primaryDark font-medium mb-5 flex items-start gap-2.5">
                  <FaFileMedical className="text-primary text-lg shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Prescription Required by Law</strong>
                    <span>You must upload a valid doctor prescription during checkout. A licensed pharmacist will verify your prescription prior to dispatch.</span>
                  </div>
                </div>
              )}

              <Paragraph pera={product.description} style="mb-5 text-sm text-text" />

              <div className="grid grid-cols-2 gap-2 text-xs bg-bgColor p-4 rounded-xl border border-border mb-6">
                <div><span className="font-bold text-heading">Pack Size:</span> {product.packSize || product.weight}</div>
                <div><span className="font-bold text-heading">Manufacturer:</span> {product.manufacturer || 'Certified Pharma'}</div>
                <div><span className="font-bold text-heading">Expiry Date:</span> {product.expiryDate || '2026-12-31'}</div>
                <div><span className="font-bold text-heading">Availability:</span> <span className="text-primary font-bold">In Stock ({product.stock || 100})</span></div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="border-t border-border pt-6">
                <label className="text-xs uppercase font-bold text-text block mb-2">
                  Select Quantity:
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-3 text-heading hover:bg-bgColor transition-colors"
                    >
                      <PiMinus />
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={quantity}
                      className="w-12 text-center text-sm font-bold text-heading outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-3 text-heading hover:bg-bgColor transition-colors"
                    >
                      <GoPlus />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product.id, quantity, product)}
                    className="bg-primary hover:bg-primaryDark text-white font-bold px-7 py-3 rounded-xl shadow-xs transition-all text-sm active:scale-95"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id, product)}
                    className={`flex items-center gap-1.5 px-4 py-3 border rounded-xl transition-colors text-sm font-semibold ${
                      isFavorite ? 'border-coral text-coral bg-coral/10' : 'border-border text-text hover:text-coral hover:border-coral'
                    }`}
                  >
                    {isFavorite ? <IoMdHeart className="text-lg" /> : <IoMdHeartEmpty className="text-lg" />}
                    <span>{isFavorite ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-border pt-5 mt-5 space-y-1.5 text-xs text-text">
              <div><strong className="text-heading">SKU:</strong> #{product.sku || 'MED-' + product.id}</div>
              <div><strong className="text-heading">Therapeutic Category:</strong> {product.categories?.join(', ') || 'Healthcare'}</div>
              <div><strong className="text-heading">Tags:</strong> {product.tags?.join(', ') || 'Medicine, Healthcare'}</div>
            </div>
          </div>

          {/* Right Pharmacy Guarantee Sidebar */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-bgColor p-5 rounded-2xl border border-border">
              <h4 className="text-xs uppercase font-extrabold text-primaryDark tracking-wider mb-3">
                Pharmacy Guarantees
              </h4>
              <div className="divide-y divide-border">
                {guarantees.map((item, index) => (
                  <div key={index} className="flex items-center py-3.5 first:pt-0 last:pb-0 gap-3">
                    <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain" />
                    <div>
                      <h5 className="text-xs font-bold text-heading">{item.title}</h5>
                      <p className="text-[11px] text-text">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primaryDark text-white p-6 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-accent block mb-1">Pharmacist Helpline</span>
              <h4 className="text-base font-bold mb-1">Need dosage guidance?</h4>
              <p className="text-xs text-teal-100/80 mb-3">Talk to a licensed clinical pharmacist 24/7</p>
              <a href="tel:1800PHARMART" className="text-xl font-black text-white hover:text-accent transition-colors block">
                1-800-PHARMART
              </a>
            </div>
          </div>
        </div>

        {/* Tabbed Medicine Information & Clinical Reviews */}
        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex border-b border-border gap-6 text-sm font-bold mb-6">
            <button
              onClick={() => setActiveTab('uses')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'uses' ? 'border-primary text-primary' : 'border-transparent text-text hover:text-heading'
              }`}
            >
              <FaInfoCircle /> Medical Uses & Benefits
            </button>
            <button
              onClick={() => setActiveTab('dosage')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'dosage' ? 'border-primary text-primary' : 'border-transparent text-text hover:text-heading'
              }`}
            >
              <FaFileMedical /> Dosage & Directions
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-text hover:text-heading'
              }`}
            >
              Patient Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {activeTab === 'uses' && (
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs leading-relaxed text-sm text-text">
              <h4 className="font-bold text-heading text-base mb-2">Therapeutic Indications</h4>
              <p>{product.uses || 'Indicated for general health maintenance and wellness as advised by a qualified healthcare professional.'}</p>
            </div>
          )}

          {activeTab === 'dosage' && (
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs leading-relaxed text-sm text-text">
              <h4 className="font-bold text-heading text-base mb-2">Recommended Administration & Dosage</h4>
              <p>{product.howToUse || 'Take as directed on the packaging or as prescribed by your doctor. Store below 25°C away from direct sunlight.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, index) => (
                    <div key={index} className="p-5 bg-white rounded-xl border border-border shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-sm text-heading">{rev.userName || rev.user_name}</h5>
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(Math.floor(rev.rating || 5))].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text italic">No reviews yet for this medicine.</p>
                )}
              </div>

              {/* Submit Patient Review */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-border shadow-xs">
                <h4 className="text-base font-bold text-heading mb-4">Add Patient Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-heading block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.userName}
                      onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                      className="w-full text-sm border border-border rounded-lg p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. David Miller"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-heading block mb-1">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full text-sm border border-border rounded-lg p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value={5}>5 Stars - Highly Effective</option>
                      <option value={4}>4 Stars - Effective</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Average</option>
                      <option value={1}>1 Star - Ineffective</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-heading block mb-1">Your Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full text-sm border border-border rounded-lg p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Share your experience with this medication..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-xs"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Patient Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SingleProduct;
