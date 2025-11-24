import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Define types for our pricing data
export interface WebsiteType {
  id?: string;
  name: string;
  price: number;
  includedPageIds?: string[]; // Add this field to track included pages
}

export interface PageType {
  id?: string;
  name: string;
  price: number;
}

export interface PaymentSystem {
  id?: string;
  name: string;
  price: number;
}

export interface ProService {
  id?: string;
  name: string;
  price: number;
}

// Collection names
const WEBSITE_TYPES_COLLECTION = 'websiteTypes';
const PAGE_TYPES_COLLECTION = 'pageTypes';
const PAYMENT_SYSTEMS_COLLECTION = 'paymentSystems';
const PRO_SERVICES_COLLECTION = 'proServices';

// Website Types CRUD
export const getWebsiteTypes = async (): Promise<WebsiteType[]> => {
  try {
    const q = query(collection(db, WEBSITE_TYPES_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        includedPageIds: data.includedPageIds || []
      } as WebsiteType;
    });
  } catch (error) {
    console.error('Error fetching website types:', error);
    throw error;
  }
};

export const createWebsiteType = async (websiteType: Omit<WebsiteType, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, WEBSITE_TYPES_COLLECTION), websiteType);
    return docRef.id;
  } catch (error) {
    console.error('Error creating website type:', error);
    throw error;
  }
};

export const updateWebsiteType = async (id: string, websiteType: Partial<WebsiteType>): Promise<void> => {
  try {
    const docRef = doc(db, WEBSITE_TYPES_COLLECTION, id);
    await updateDoc(docRef, websiteType);
  } catch (error) {
    console.error('Error updating website type:', error);
    throw error;
  }
};

export const deleteWebsiteType = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, WEBSITE_TYPES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting website type:', error);
    throw error;
  }
};

// Page Types CRUD
export const getPageTypes = async (): Promise<PageType[]> => {
  try {
    const q = query(collection(db, PAGE_TYPES_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PageType));
  } catch (error) {
    console.error('Error fetching page types:', error);
    throw error;
  }
};

export const createPageType = async (pageType: Omit<PageType, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PAGE_TYPES_COLLECTION), pageType);
    return docRef.id;
  } catch (error) {
    console.error('Error creating page type:', error);
    throw error;
  }
};

export const updatePageType = async (id: string, pageType: Partial<PageType>): Promise<void> => {
  try {
    const docRef = doc(db, PAGE_TYPES_COLLECTION, id);
    await updateDoc(docRef, pageType);
  } catch (error) {
    console.error('Error updating page type:', error);
    throw error;
  }
};

export const deletePageType = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PAGE_TYPES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting page type:', error);
    throw error;
  }
};

// Payment Systems CRUD
export const getPaymentSystems = async (): Promise<PaymentSystem[]> => {
  try {
    const q = query(collection(db, PAYMENT_SYSTEMS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PaymentSystem));
  } catch (error) {
    console.error('Error fetching payment systems:', error);
    throw error;
  }
};

export const createPaymentSystem = async (paymentSystem: Omit<PaymentSystem, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PAYMENT_SYSTEMS_COLLECTION), paymentSystem);
    return docRef.id;
  } catch (error) {
    console.error('Error creating payment system:', error);
    throw error;
  }
};

export const updatePaymentSystem = async (id: string, paymentSystem: Partial<PaymentSystem>): Promise<void> => {
  try {
    const docRef = doc(db, PAYMENT_SYSTEMS_COLLECTION, id);
    await updateDoc(docRef, paymentSystem);
  } catch (error) {
    console.error('Error updating payment system:', error);
    throw error;
  }
};

export const deletePaymentSystem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PAYMENT_SYSTEMS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting payment system:', error);
    throw error;
  }
};

// Pro Services CRUD
export const getProServices = async (): Promise<ProService[]> => {
  try {
    const q = query(collection(db, PRO_SERVICES_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProService));
  } catch (error) {
    console.error('Error fetching pro services:', error);
    throw error;
  }
};

export const createProService = async (proService: Omit<ProService, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PRO_SERVICES_COLLECTION), proService);
    return docRef.id;
  } catch (error) {
    console.error('Error creating pro service:', error);
    throw error;
  }
};

export const updateProService = async (id: string, proService: Partial<ProService>): Promise<void> => {
  try {
    const docRef = doc(db, PRO_SERVICES_COLLECTION, id);
    await updateDoc(docRef, proService);
  } catch (error) {
    console.error('Error updating pro service:', error);
    throw error;
  }
};

export const deleteProService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PRO_SERVICES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting pro service:', error);
    throw error;
  }
};