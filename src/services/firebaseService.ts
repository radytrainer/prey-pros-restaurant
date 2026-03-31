import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { UserProfile, MenuItem, Ingredient, Order, Table, Sale, OrderStatus } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const createUserProfile = async (profile: UserProfile): Promise<void> => {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const path = 'menu';
  try {
    const querySnapshot = await getDocs(collection(db, 'menu'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const subscribeToMenuItems = (callback: (items: MenuItem[]) => void) => {
  const path = 'menu';
  return onSnapshot(collection(db, 'menu'), (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const createMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
  const path = 'menu';
  try {
    const docRef = await addDoc(collection(db, 'menu'), item);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<void> => {
  const path = `menu/${id}`;
  try {
    const docRef = doc(db, 'menu', id);
    await updateDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const path = `menu/${id}`;
  try {
    const docRef = doc(db, 'menu', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Inventory
export const getIngredients = async (): Promise<Ingredient[]> => {
  const path = 'inventory';
  try {
    const querySnapshot = await getDocs(collection(db, 'inventory'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const subscribeToIngredients = (callback: (items: Ingredient[]) => void) => {
  const path = 'inventory';
  return onSnapshot(collection(db, 'inventory'), (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const createIngredient = async (ingredient: Omit<Ingredient, 'id'>): Promise<string> => {
  const path = 'inventory';
  try {
    const docRef = await addDoc(collection(db, 'inventory'), ingredient);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

// Orders
export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const subscribeToOrders = (callback: (orders: Order[]) => void, filters?: { userId?: string; tableNumber?: string }) => {
  const path = 'orders';
  let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  
  if (filters?.userId) {
    q = query(q, where('userId', '==', filters.userId));
  } else if (filters?.tableNumber) {
    q = query(q, where('tableNumber', '==', filters.tableNumber));
  }

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
    if (status === 'completed') {
      const orderSnap = await getDoc(doc(db, 'orders', orderId));
      if (orderSnap.exists()) {
        const orderData = orderSnap.data() as Order;
        await addDoc(collection(db, 'sales'), {
          orderId,
          amount: orderData.totalPrice,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Sales
export const getSales = async (): Promise<Sale[]> => {
  const path = 'sales';
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getTables = async (): Promise<Table[]> => {
  const path = 'tables';
  try {
    const querySnapshot = await getDocs(collection(db, 'tables'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createTable = async (table: Omit<Table, 'id'>): Promise<string> => {
  const path = 'tables';
  try {
    const docRef = await addDoc(collection(db, 'tables'), table);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateTable = async (id: string, table: Partial<Table>): Promise<void> => {
  const path = `tables/${id}`;
  try {
    await updateDoc(doc(db, 'tables', id), table);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteTable = async (id: string): Promise<void> => {
  const path = `tables/${id}`;
  try {
    await deleteDoc(doc(db, 'tables', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
