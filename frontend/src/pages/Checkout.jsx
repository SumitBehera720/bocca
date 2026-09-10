import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/cartService';
import { uploadPrescription } from '../services/prescriptionService';
import { FaFilePrescription, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, hasPrescriptionItems, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.username || '',
    customerEmail: user?.email || '',
    phone: '',
    shippingAddress: '',
    paymentMethod: 'Cash On Delivery'
  });

  const [prescriptionData, setPrescriptionData] = useState({
    patientName: user?.username || '',
    doctorName: '',
    prescriptionFile: '',
    notes: ''
  });

  const [prescriptionFilePreview, setPrescriptionFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const shipping = cartTotal > 200 || cartTotal === 0 ? 0 : 15.00;
  const grandTotal = (cartTotal + shipping).toFixed(2);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionFilePreview(reader.result);
        setPrescriptionData(prev => ({ ...prev, prescriptionFile: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePrescription = () => {
    const sampleUrl = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
    setPrescriptionFilePreview(sampleUrl);
    setPrescriptionData(prev => ({
      ...prev,
      doctorName: 'Dr. Robert Williams (MD #84920)',
      prescriptionFile: sampleUrl,
      notes: 'Prescription for respiratory antibiotic treatment.'
    }));
    toast.success('Sample certified prescription attached!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.shippingAddress) {
      toast.error('Please complete all required delivery fields');
      return;
    }

    if (hasPrescriptionItems && !prescriptionData.prescriptionFile) {
      toast.error('Please upload your doctor prescription before finalizing this Rx order.');
      return;
    }

    try {
      setLoading(true);
      let attachedPrescriptionId = null;

      // 1. Upload prescription if needed
      if (hasPrescriptionItems) {
        const rxRes = await uploadPrescription({
          patientName: prescriptionData.patientName || formData.customerName,
          doctorName: prescriptionData.doctorName || 'Dr. Assigned',
          prescriptionFile: prescriptionData.prescriptionFile,
          notes: prescriptionData.notes
        });
        attachedPrescriptionId = rxRes.id;
      }

      // 2. Create the order
      const orderPayload = {
        ...formData,
        totalAmount: grandTotal,
        hasPrescriptionItems: hasPrescriptionItems ? 1 : 0,
        prescriptionId: attachedPrescriptionId,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          requiresPrescription: item.requiresPrescription ? 1 : 0
        }))
      };

      const res = await createOrder(orderPayload);
      setCompletedOrder(res);
      await fetchCart();
      toast.success('Pharmacy order submitted successfully!');
    } catch (err) {
      console.error('Order creation error:', err);
      toast.error(err.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <Container className="py-20 text-center">
        <div className="max-w-lg mx-auto bg-white p-8 md:p-10 rounded-3xl border border-border shadow-md">
          <div className="w-20 h-20 bg-emerald-50 text-success rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner">
            <FaCheckCircle />
          </div>
          <span className="text-xs uppercase font-extrabold text-primary tracking-widest block mb-1">
            Order Confirmed & Logged
          </span>
          <h2 className="text-2xl font-black text-heading mb-2">Thank You For Your Order!</h2>
          <p className="text-xs text-text mb-6">
            Your Order Reference is <strong className="text-heading font-mono">#{completedOrder.id || 'RX-7729'}</strong>.
            {hasPrescriptionItems 
              ? ' A licensed pharmacist will review your attached prescription before dispatch.'
              : ' Your pharmacy package is being packed for express cold-chain delivery.'}
          </p>

          <div className="bg-bgColor p-4 rounded-2xl border border-border text-xs text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-text">Delivery To:</span>
              <strong className="text-heading">{formData.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text">Total Amount:</span>
              <strong className="text-primaryDark font-bold">${grandTotal}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text">Payment Method:</span>
              <strong className="text-heading">{formData.paymentMethod}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-primary hover:bg-primaryDark text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-xs"
            >
              Order More Medicines
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto bg-bgColor hover:bg-primaryLight text-heading font-bold px-6 py-3 rounded-xl text-xs transition-colors border border-border"
            >
              Return Home
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-10 bg-bgColor min-h-screen">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-heading">
            Pharmacy Checkout
          </h1>
          <p className="text-xs text-text mt-1">
            Safe healthcare checkout • Certified dispensary fulfillment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Prescription (Rx) Upload Box */}
            {hasPrescriptionItems && (
              <div className="bg-primaryLight/40 border-2 border-dashed border-primary/40 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg shadow">
                    <FaFilePrescription />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primaryDark">Doctor Prescription (Rx) Upload Required</h3>
                    <p className="text-xs text-text">Your cart contains prescription drugs mandated by pharmacy regulations.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-heading block mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={prescriptionData.patientName}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, patientName: e.target.value })}
                      className="w-full text-xs border border-border bg-white rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Name on prescription"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-heading block mb-1">Prescribing Doctor / Clinic</label>
                    <input
                      type="text"
                      value={prescriptionData.doctorName}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, doctorName: e.target.value })}
                      className="w-full text-xs border border-border bg-white rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Dr. Williams, MD"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-heading block mb-1">
                    Upload Prescription Image / PDF *
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primaryLight file:text-primary hover:file:bg-primary hover:file:text-white cursor-pointer border border-border bg-white rounded-xl p-2 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleUseSamplePrescription}
                      className="shrink-0 text-xs bg-white hover:bg-primaryLight text-primary border border-border font-bold px-3.5 py-2.5 rounded-xl transition-colors"
                    >
                      Use Demo Rx
                    </button>
                  </div>
                </div>

                {prescriptionFilePreview && (
                  <div className="p-3 bg-white rounded-xl border border-primary/30 flex items-center gap-4 shadow-2xs">
                    <img src={prescriptionFilePreview} alt="Rx Preview" className="w-16 h-16 object-cover rounded-lg border border-primary/20" />
                    <div className="text-xs">
                      <span className="text-primary font-bold block">✓ Prescription Document Attached</span>
                      <span className="text-text">Ready for clinical pharmacist verification</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-xs space-y-4">
              <h3 className="text-base font-bold text-heading pb-3 border-b border-border">
                Patient & Delivery Address
              </h3>

              <div>
                <label className="text-xs font-bold text-heading block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-heading block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-heading block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-heading block mb-1">Delivery Street Address *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Complete street, apartment, city, and zip code"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <label className="text-xs font-bold text-heading block mb-2">Payment Method</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-bgColor transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash On Delivery"
                      checked={formData.paymentMethod === 'Cash On Delivery'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-primary"
                    />
                    <span className="font-semibold text-heading">Cash On Delivery / Pay on Inspection</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-bgColor transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Card Payment"
                      checked={formData.paymentMethod === 'Online Card Payment'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-primary"
                    />
                    <span className="font-semibold text-heading">Credit / Debit Card / Health Savings (HSA/FSA)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Review Sidebar */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-border shadow-xs h-fit">
            <h3 className="text-base font-bold text-heading pb-3 border-b border-border mb-4">
              Medicine Order Review ({cartItems.length} items)
            </h3>

            <div className="divide-y divide-border max-h-64 overflow-y-auto mb-4 pr-1">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.productName} className="w-10 h-10 object-contain rounded-lg bg-bgColor p-1 border border-border" />
                    <div>
                      <span className="font-bold text-heading line-clamp-1">{item.productName}</span>
                      <span className="text-text/70">Qty: {item.quantity} × ${item.price}</span>
                    </div>
                  </div>
                  <span className="font-bold text-heading">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-text border-t border-border pt-4">
              <div className="flex justify-between">
                <span>Medicines Total</span>
                <span className="font-bold text-heading">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Cold-Chain Shipping</span>
                <span className="font-bold text-heading">
                  {shipping === 0 ? <span className="text-primary font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-heading border-t border-border pt-3">
                <span>Total Due</span>
                <span className="text-lg text-primaryDark">${grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3.5 rounded-xl mt-6 shadow-xs transition-colors text-xs active:scale-98"
            >
              {loading ? 'Validating Order...' : hasPrescriptionItems ? 'Submit Order with Prescription' : 'Place Medicine Order'}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Checkout;
