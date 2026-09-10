import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaPills, 
  FaShoppingBag, 
  FaClipboardCheck, 
  FaUsers, 
  FaTags, 
  FaStar, 
  FaPlus, 
  FaSearch, 
  FaSync, 
  FaEdit, 
  FaTrash, 
  FaUpload, 
  FaSignOutAlt, 
  FaExternalLinkAlt, 
  FaShieldAlt, 
  FaDollarSign, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaFileImage
} from 'react-icons/fa';
import prescriptionService from '../services/prescriptionService';
import productService from '../services/productService';
import orderService from '../services/orderService';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import uploadService from '../services/uploadService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [prescriptions, setPrescriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedRxFilter, setSelectedRxFilter] = useState('');

  // Modals
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    brand_name: 'Cipla',
    category_id: 1,
    price: '',
    old_price: '',
    stock: 100,
    pack_size: '10 Tablets Strip',
    manufacturer: 'Pharmaceuticals Ltd.',
    description: '',
    uses: '',
    how_to_use: 'Take 1 tablet after meals as prescribed.',
    requires_prescription: 0,
    is_top_saver: 0,
    is_best_seller: 0,
    image_url: '/images/products/product-1.jpg'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rxRes, prodRes, ordRes, usrRes, catRes, brdRes, revRes] = await Promise.all([
        prescriptionService.getAllPrescriptions().catch(() => []),
        productService.getProducts({ limit: 200 }).catch(() => []),
        orderService.getAllOrders().catch(() => []),
        userService.getUsers().catch(() => []),
        productService.getCategories().catch(() => []),
        productService.getBrands().catch(() => []),
        reviewService.getReviews().catch(() => [])
      ]);

      setPrescriptions(Array.isArray(rxRes) ? rxRes : rxRes?.data || []);
      setProducts(Array.isArray(prodRes) ? prodRes : prodRes?.data || []);
      setOrders(Array.isArray(ordRes) ? ordRes : ordRes?.data || []);
      setUsers(Array.isArray(usrRes) ? usrRes : usrRes?.data || []);
      setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
      setBrands(Array.isArray(brdRes) ? brdRes : brdRes?.data || []);
      setReviews(Array.isArray(revRes) ? revRes : revRes?.data || []);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
      toast.error('Could not load all admin records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.email === 'admin@farmart.com')) {
      fetchData();
    }
  }, [user]);

  // --- Handlers ---
  const handleDeviceImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    toast.loading('Uploading image from your device...', { id: 'upload' });
    try {
      const uploadedUrl = await uploadService.uploadDeviceImage(file);
      setProductForm(prev => ({ ...prev, image_url: uploadedUrl }));
      toast.success('Image uploaded successfully from device!', { id: 'upload' });
    } catch (err) {
      toast.error('Failed to upload image: ' + err.message, { id: 'upload' });
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand_name: 'Cipla',
      category_id: 1,
      price: '',
      old_price: '',
      stock: 100,
      pack_size: '10 Tablets Strip',
      manufacturer: 'Pharmaceuticals Ltd.',
      description: '',
      uses: '',
      how_to_use: 'Take 1 tablet after meals as prescribed.',
      requires_prescription: 0,
      is_top_saver: 0,
      is_best_seller: 0,
      image_url: '/images/products/product-1.jpg'
    });
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.product_name || product.productName || product.name || '',
      brand_name: product.brand_name || product.brand || 'Cipla',
      category_id: product.category_id || 1,
      price: product.price || '',
      old_price: product.old_price || product.oldPrice || '',
      stock: product.stock ?? 100,
      pack_size: product.pack_size || product.packSize || '10 Tablets Strip',
      manufacturer: product.manufacturer || 'Pharmart Labs',
      description: product.description || '',
      uses: product.uses || '',
      how_to_use: product.how_to_use || product.howToUse || '',
      requires_prescription: product.requires_prescription ? 1 : 0,
      is_top_saver: product.is_top_saver ? 1 : 0,
      is_best_seller: product.is_best_seller ? 1 : 0,
      image_url: product.image || product.image_url || '/images/products/product-1.jpg'
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        old_price: productForm.old_price ? parseFloat(productForm.old_price) : 0,
        stock: parseInt(productForm.stock),
        requires_prescription: parseInt(productForm.requires_prescription),
        is_top_saver: parseInt(productForm.is_top_saver),
        is_best_seller: parseInt(productForm.is_best_seller)
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast.success('New medicine added to store catalog!');
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save product: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from inventory?`)) return;
    setActionLoading(true);
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjustStock = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await productService.updateProduct(product.id, { stock: newStock });
      toast.success(`Stock updated to ${newStock}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to adjust stock: ' + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success(`Order #${orderId} status set to ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update order status: ' + err.message);
    }
  };

  const handleUpdateRxStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await prescriptionService.updatePrescriptionStatus(id, {
        status,
        pharmacistNotes: reviewNotes || (status === 'approved' ? 'Verified by certified pharmacist' : 'Illegible signature or invalid Rx file')
      });
      toast.success(`Prescription ${status}`);
      setSelectedPrescription(null);
      setReviewNotes('');
      fetchData();
    } catch (err) {
      toast.error('Failed to update Rx status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await userService.updateUserRole(userId, role);
      toast.success(`User role updated to ${role}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update user role: ' + err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete customer review?')) return;
    try {
      await reviewService.deleteReview(id);
      toast.success('Review removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete review: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const name = (p.product_name || p.productName || p.name || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter ? String(p.category_id) === String(selectedCategoryFilter) : true;
    const matchesRx = selectedRxFilter !== '' ? String(p.requires_prescription) === String(selectedRxFilter) : true;
    return matchesSearch && matchesCategory && matchesRx;
  });

  const pendingPrescriptions = prescriptions.filter(p => (p.status || '').toLowerCase().includes('pending'));
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-inter overflow-hidden">
      
      {/* 1. STANDALONE Enterprise Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-500/20">
                ⚡
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-wide">PHARMART</h1>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">ADMIN PORTAL PRO</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {[
              { id: 'analytics', label: 'Dashboard & Metrics', icon: FaChartLine },
              { id: 'products', label: 'Medicine Inventory', badge: products.length, icon: FaPills },
              { id: 'orders', label: 'Order Fulfillment', badge: orders.length, icon: FaShoppingBag },
              { id: 'prescriptions', label: 'Prescription Audit', badge: pendingPrescriptions.length, badgeColor: 'bg-amber-500 text-slate-950', icon: FaClipboardCheck },
              { id: 'users', label: 'User Accounts', badge: users.length, icon: FaUsers },
              { id: 'categories', label: 'Categories & Brands', icon: FaTags },
              { id: 'reviews', label: 'Review Moderation', badge: reviews.length, icon: FaStar },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-sm" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${item.badgeColor || (isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300')}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-sm border border-slate-700">
              <FaShieldAlt />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user?.name || user?.username || 'Pharmacist Admin'}</span>
              <span className="text-[10px] text-slate-400 block truncate">License #PH-2026-8891</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
            <Link 
              to="/" 
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-all"
            >
              <FaExternalLinkAlt className="text-[10px]" /> Live Store
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
            >
              <FaSignOutAlt className="text-[10px]" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {activeTab === 'analytics' && 'Executive Analytics & Financial KPIs'}
              {activeTab === 'products' && 'Medicine Inventory & Stock Controls'}
              {activeTab === 'orders' && 'Order Processing & Delivery Dispatch'}
              {activeTab === 'prescriptions' && 'Doctor Prescription Verification Portal'}
              {activeTab === 'users' && 'User Accounts & Role Permissions'}
              {activeTab === 'categories' && 'Categories & Brand Manufacturers'}
              {activeTab === 'reviews' && 'Customer Review Moderation'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <FaPlus /> Add New Medicine
            </button>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <FaSync className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </header>

        {/* Dynamic Scrollable Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: EXECUTIVE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center text-xl">
                    <FaDollarSign />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales Revenue</span>
                    <span className="text-2xl font-black text-white">${totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl">
                    <FaClock />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Rx Audits</span>
                    <span className="text-2xl font-black text-amber-400">{pendingPrescriptions.length}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center text-xl">
                    <FaShoppingBag />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
                    <span className="text-2xl font-black text-white">{orders.length}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center text-xl">
                    <FaPills />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Catalog Inventory Items</span>
                    <span className="text-2xl font-black text-white">{products.length}</span>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert Table */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FaExclamationTriangle className="text-amber-400" /> Inventory Stock Level Alerts
                  </h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs font-bold text-emerald-400 hover:underline">
                    View Full Inventory →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase bg-slate-950/50">
                        <th className="p-3">Medicine Name</th>
                        <th className="p-3">Pack Size</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Quick Restock Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {products.slice(0, 5).map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">{p.product_name || p.name}</td>
                          <td className="p-3 text-slate-400">{p.pack_size || p.packSize || '1 Strip'}</td>
                          <td className="p-3 font-semibold text-white">${parseFloat(p.price || 0).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${
                              (p.stock || 0) < 50 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {p.stock || 0} Units
                            </span>
                          </td>
                          <td className="p-3">
                            <button 
                              onClick={() => handleAdjustStock(p, 50)}
                              className="px-3 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold rounded-lg transition-all border border-slate-700 cursor-pointer"
                            >
                              + Add 50 Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & STOCK MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines by name or brand..."
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-white placeholder-slate-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  <select
                    value={selectedRxFilter}
                    onChange={(e) => setSelectedRxFilter(e.target.value)}
                    className="text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold"
                  >
                    <option value="">All Drug Types</option>
                    <option value="0">OTC (Over the Counter)</option>
                    <option value="1">Rx (Prescription Required)</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase bg-slate-950/60">
                      <th className="p-3">ID</th>
                      <th className="p-3">Medicine Image & Name</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Rx Requirement</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-400">#{p.id}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image || '/images/products/product-1.jpg'} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-700 bg-slate-950" />
                            <div>
                              <span className="font-bold text-white block">{p.product_name || p.name}</span>
                              <span className="text-[10px] text-slate-400">{p.pack_size || p.packSize}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-300 font-medium">{p.brand_name || p.manufacturer || 'Cipla'}</td>
                        <td className="p-3 font-bold text-emerald-400">${parseFloat(p.price || 0).toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase ${
                            p.requires_prescription ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {p.requires_prescription ? 'Rx Required' : 'OTC Medicine'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{p.stock || 0}</span>
                            <button onClick={() => handleAdjustStock(p, -10)} className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center font-bold text-slate-300 hover:bg-red-500 hover:text-white cursor-pointer">-</button>
                            <button onClick={() => handleAdjustStock(p, 10)} className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center font-bold text-slate-300 hover:bg-emerald-500 hover:text-slate-950 cursor-pointer">+</button>
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="px-2.5 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-slate-950 font-bold rounded-lg transition-all cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id, p.product_name || p.name)}
                            className="px-2.5 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-slate-950 font-bold rounded-lg transition-all cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Order Processing & Fulfillment Dispatch</h3>
                <span className="text-xs text-slate-400 font-semibold">Total Orders: {orders.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase bg-slate-950/60">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Rx Badge</th>
                      <th className="p-3">Delivery Status</th>
                      <th className="p-3 rounded-r-xl">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-emerald-400">#{o.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-white block">{o.customer_name || o.customerName}</span>
                          <span className="text-[10px] text-slate-400">{o.customer_email || o.customerEmail}</span>
                        </td>
                        <td className="p-3 font-bold text-white">${parseFloat(o.total_amount || 0).toFixed(2)}</td>
                        <td className="p-3 text-slate-300 font-medium">{o.payment_method || 'Cash On Delivery'}</td>
                        <td className="p-3">
                          {o.has_prescription_items ? (
                            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold rounded">Rx Item Attached</span>
                          ) : (
                            <span className="text-[10px] text-slate-400">OTC Standard</span>
                          )}
                        </td>
                        <td className="p-3">
                          <select
                            value={o.status || 'Pending Verification'}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="text-xs font-bold bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none"
                          >
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRESCRIPTION AUDIT & REVIEW */}
          {activeTab === 'prescriptions' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Patient Prescription Verification Portal</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full">
                  {pendingPrescriptions.length} Pending Audits
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="p-5 border border-slate-800 rounded-2xl bg-slate-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Rx #{rx.id}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${
                        rx.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        rx.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {rx.status || 'Pending'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white block">Patient: {rx.patient_name || rx.patientName}</span>
                      <span className="text-[11px] text-slate-400 block">Doctor: {rx.doctor_name || rx.doctorName || 'Dr. Unspecified'}</span>
                    </div>

                    <div className="h-36 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                      <img 
                        src={rx.prescription_file || rx.prescriptionFile || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'} 
                        alt="Doctor Prescription" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      onClick={() => setSelectedPrescription(rx)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                    >
                      Audit Prescription
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USER ROLE MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg">
              <h3 className="text-sm font-bold text-white">User Accounts & Role Permissions</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase bg-slate-950/60">
                      <th className="p-3">User ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Role Status</th>
                      <th className="p-3">Change Role Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-400">#{u.id}</td>
                        <td className="p-3 font-bold text-white">{u.name || u.username}</td>
                        <td className="p-3 text-slate-300 font-medium">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            u.role === 'pharmacist' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {u.role || 'customer'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={u.role || 'customer'}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className="text-xs font-bold bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 outline-none"
                          >
                            <option value="customer">Customer</option>
                            <option value="pharmacist">Pharmacist</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CATEGORIES & BRANDS */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white">Product Categories</h3>
                <div className="space-y-2">
                  {categories.map(c => (
                    <div key={c.id} className="p-3 border border-slate-800 rounded-xl flex items-center justify-between bg-slate-950/60 text-xs">
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">slug: {c.slug}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">Active Category</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white">Brand Manufacturers</h3>
                <div className="space-y-2">
                  {brands.map(b => (
                    <div key={b.id} className="p-3 border border-slate-800 rounded-xl flex items-center justify-between bg-slate-950/60 text-xs">
                      <div>
                        <span className="font-bold text-white block">{b.brand_name || b.name}</span>
                        <span className="text-[10px] text-slate-400">{b.title}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded">Partner Brand</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg">
              <h3 className="text-sm font-bold text-white">Customer Reviews & Ratings Moderation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 border border-slate-800 rounded-xl bg-slate-950 space-y-2 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{r.user_name || 'Customer'}</span>
                        <span className="text-amber-400 font-bold text-xs flex items-center gap-1"><FaStar /> {r.rating}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic mt-1">"{r.comment}"</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL 1: ADD / EDIT PRODUCT MODAL WITH DIRECT DEVICE UPLOAD --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {editingProduct ? 'Edit Medicine Details' : 'Add New Medicine to Store Catalog'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 font-bold text-lg hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 block mb-1">Product / Medicine Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Paracetamol Extra Strength 650mg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              {/* DIRECT DEVICE IMAGE UPLOADER */}
              <div className="sm:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="font-bold text-white block">Medicine Product Image</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img 
                    src={productForm.image_url || '/images/products/product-1.jpg'} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-slate-900"
                  />

                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold rounded-xl cursor-pointer transition-all">
                      <FaUpload /> {uploadingImage ? 'Uploading Device Image...' : 'Choose Image File from Computer / Device'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleDeviceImageUpload}
                        className="hidden" 
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 block text-center">Supports JPG, PNG, WEBP files directly from your computer</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={productForm.brand_name}
                  onChange={(e) => setProductForm({ ...productForm, brand_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Pack Size / Unit</label>
                <input
                  type="text"
                  required
                  value={productForm.pack_size}
                  onChange={(e) => setProductForm({ ...productForm, pack_size: e.target.value })}
                  placeholder="e.g. 10 Tablets Strip"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.old_price}
                  onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Prescription Requirement</label>
                <select
                  value={productForm.requires_prescription}
                  onChange={(e) => setProductForm({ ...productForm, requires_prescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 outline-none focus:border-emerald-500 font-bold"
                >
                  <option value={0}>OTC (Over the Counter)</option>
                  <option value={1}>Rx (Doctor Prescription Required)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 block mb-1">Therapeutic Uses</label>
                <textarea
                  rows={2}
                  value={productForm.uses}
                  onChange={(e) => setProductForm({ ...productForm, uses: e.target.value })}
                  placeholder="Fever relief, headache, muscle pain..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage}
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl hover:bg-emerald-400 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INSPECT PRESCRIPTION MODAL --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Audit Prescription #{selectedPrescription.id}</h3>
              <button onClick={() => setSelectedPrescription(null)} className="text-slate-400 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div><span className="text-slate-400 block">Patient Name:</span> <span className="font-bold text-white">{selectedPrescription.patient_name || selectedPrescription.patientName}</span></div>
                <div><span className="text-slate-400 block">Doctor Name:</span> <span className="font-bold text-white">{selectedPrescription.doctor_name || selectedPrescription.doctorName || 'Dr. Unspecified'}</span></div>
              </div>

              <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedPrescription.prescription_file || selectedPrescription.prescriptionFile || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'} 
                  alt="Prescription Document" 
                  className="max-h-full object-contain"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Pharmacist Notes</label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Verified doctor signature, patient name..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => handleUpdateRxStatus(selectedPrescription.id, 'rejected')}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaTimesCircle /> Reject
                </button>
                <button
                  onClick={() => handleUpdateRxStatus(selectedPrescription.id, 'approved')}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaCheckCircle /> Verify & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Order Details #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div><span className="font-bold text-white">Customer:</span> {selectedOrder.customer_name || selectedOrder.customerName} ({selectedOrder.customer_email || selectedOrder.customerEmail})</div>
                <div><span className="font-bold text-white">Phone:</span> {selectedOrder.phone || 'N/A'}</div>
                <div><span className="font-bold text-white">Address:</span> {selectedOrder.shipping_address || selectedOrder.shippingAddress}</div>
                <div><span className="font-bold text-white">Payment Method:</span> {selectedOrder.payment_method || 'Cash On Delivery'}</div>
              </div>

              <div>
                <span className="font-bold text-white block">Total Amount: <span className="text-emerald-400">${parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</span></span>
              </div>

              <div className="pt-2 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 cursor-pointer">
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
