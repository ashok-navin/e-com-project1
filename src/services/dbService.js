import { db } from '../firebase';

import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, 
  updateDoc, deleteDoc, onSnapshot, query, orderBy 
} from 'firebase/firestore';

// --- 1. USER DETAILS DATABASE SERVICES ---
export const saveUserToDB = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    city: userData.city || '',
    role: userData.role || 'customer',
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const getUserFromDB = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

// --- 2. PRODUCT & CATEGORY DATABASE SERVICES ---
export const addProductToDB = async (productData) => {
  return await addDoc(collection(db, 'products'), {
    ...productData,
    price: Number(productData.price),
    stock: Number(productData.stock),
    rating: Number(productData.rating || 5.0),
    reviewsCount: Number(productData.reviewsCount || 1),
    createdAt: new Date().toISOString()
  });
};

export const updateProductInDB = async (productId, updatedData) => {
  const prodRef = doc(db, 'products', productId);
  await updateDoc(prodRef, {
    ...updatedData,
    price: Number(updatedData.price),
    stock: Number(updatedData.stock),
    updatedAt: new Date().toISOString()
  });
};

export const deleteProductFromDB = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
};

export const updateStockInDB = async (productId, newStock) => {
  const prodRef = doc(db, 'products', productId);
  await updateDoc(prodRef, { stock: Math.max(0, Number(newStock)) });
};

// --- 3. CART & ORDER DETAILS + PAYMENT TRANSACTION SERVICES ---
export const createOrderInDB = async (orderPayload) => {
  const orderRef = await addDoc(collection(db, 'orders'), {
    orderId: orderPayload.orderId,
    customer: {
      userId: orderPayload.customer.userId || null,
      name: orderPayload.customer.name,
      email: orderPayload.customer.email,
      phone: orderPayload.customer.phone,
      address: orderPayload.customer.address,
      city: orderPayload.customer.city
    },
    items: orderPayload.items.map(item => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.image || ''
    })),
    subtotal: Number(orderPayload.subtotal),
    tax: Number(orderPayload.tax),
    totalAmount: Number(orderPayload.totalAmount),
    currency: orderPayload.currency || 'USD',
    // Payment Status & Transaction Details
    paymentDetails: {
      method: orderPayload.paymentMethod, // 'COD' | 'ONLINE_UPI_CARD'
      status: orderPayload.paymentStatus || 'Pending', // 'Pending' | 'Completed' | 'Failed'
      transactionId: orderPayload.transactionId || 'N/A', // Gateway transaction ID
      paidAt: orderPayload.paidAt || null
    },
    orderStatus: 'Pending', // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
    createdAt: new Date().toISOString()
  });
  return orderRef.id;
};

export const updateOrderStatusInDB = async (orderId, newStatus) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { orderStatus: newStatus });
};

export const deleteOrderFromDB = async (orderId) => {
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
};