import api from './api';

const unwrapData = (res) => {
  if (res && Array.isArray(res.data)) return res.data;
  if (res && res.data !== undefined) return res.data;
  if (Array.isArray(res)) return res;
  return res;
};

// --- LocalStorage Fallback Helpers ---
const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem('farmart_local_cart') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem('farmart_local_cart', JSON.stringify(items));
  } catch (e) {}
};

const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('farmart_local_wishlist') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem('farmart_local_wishlist', JSON.stringify(items));
  } catch (e) {}
};

// --- Cart API Methods ---
export const getCart = async () => {
  try {
    const res = await api.get('/cart');
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalCart(items);
      return items;
    }
    return getLocalCart();
  } catch (err) {
    console.warn('Backend cart fetch failed, using local storage cart:', err.message);
    return getLocalCart();
  }
};

export const addToCart = async (productId, quantity = 1, productDetails = {}) => {
  try {
    const res = await api.post('/cart', { productId, quantity });
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalCart(items);
      return items;
    }
  } catch (err) {
    console.warn('Backend cart add failed, using local storage fallback:', err.message);
  }

  // Fallback local cart operation
  const cart = getLocalCart();
  const index = cart.findIndex(i => Number(i.productId || i.id) === Number(productId));
  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      id: Date.now(),
      cartItemId: Date.now(),
      productId: Number(productId),
      productName: productDetails.productName || productDetails.name || 'Medicine Product',
      price: Number(productDetails.price || 9.99),
      image: productDetails.image || '/images/products/product-1.jpg',
      quantity,
      requiresPrescription: Boolean(productDetails.requiresPrescription),
      packSize: productDetails.packSize || '1 Pack'
    });
  }
  saveLocalCart(cart);
  return cart;
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const res = await api.put(`/cart/${cartItemId}`, { quantity });
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalCart(items);
      return items;
    }
  } catch (err) {
    console.warn('Backend cart update failed:', err.message);
  }

  const cart = getLocalCart();
  const index = cart.findIndex(i => Number(i.cartItemId || i.id) === Number(cartItemId));
  if (index > -1) {
    cart[index].quantity = Math.max(1, quantity);
    saveLocalCart(cart);
  }
  return cart;
};

export const removeCartItem = async (cartItemId) => {
  try {
    const res = await api.delete(`/cart/${cartItemId}`);
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalCart(items);
      return items;
    }
  } catch (err) {
    console.warn('Backend cart remove failed:', err.message);
  }

  const cart = getLocalCart().filter(i => Number(i.cartItemId || i.id) !== Number(cartItemId));
  saveLocalCart(cart);
  return cart;
};

// --- Wishlist API Methods ---
export const getWishlist = async () => {
  try {
    const res = await api.get('/wishlist');
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalWishlist(items);
      return items;
    }
    return getLocalWishlist();
  } catch (err) {
    console.warn('Backend wishlist fetch failed, using local storage:', err.message);
    return getLocalWishlist();
  }
};

export const toggleWishlist = async (productId, productDetails = {}) => {
  try {
    const res = await api.post('/wishlist', { productId });
    if (res && res.wishlist !== undefined) {
      const items = Array.isArray(res.wishlist) ? res.wishlist : unwrapData(res.wishlist);
      saveLocalWishlist(items);
      return { added: res.added, wishlist: items };
    }
  } catch (err) {
    console.warn('Backend wishlist toggle failed, using local storage fallback:', err.message);
  }

  let wishlist = getLocalWishlist();
  const index = wishlist.findIndex(i => Number(i.productId || i.id) === Number(productId));
  let added = false;
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({
      id: Date.now(),
      wishlistId: Date.now(),
      productId: Number(productId),
      productName: productDetails.productName || productDetails.name || 'Medicine Product',
      price: Number(productDetails.price || 9.99),
      image: productDetails.image || '/images/products/product-1.jpg'
    });
    added = true;
  }
  saveLocalWishlist(wishlist);
  return { added, wishlist };
};

export const removeWishlist = async (wishlistId) => {
  try {
    const res = await api.delete(`/wishlist/${wishlistId}`);
    const items = unwrapData(res);
    if (Array.isArray(items)) {
      saveLocalWishlist(items);
      return items;
    }
  } catch (err) {
    console.warn('Backend wishlist remove failed:', err.message);
  }

  const wishlist = getLocalWishlist().filter(i => Number(i.wishlistId || i.id) !== Number(wishlistId));
  saveLocalWishlist(wishlist);
  return wishlist;
};

// --- Orders ---
export const createOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);
  localStorage.removeItem('farmart_local_cart');
  return unwrapData(res);
};
