import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Define the structure for quote requests
interface QuoteRequest {
  websiteType: {
    id?: string;
    name: string;
    price: number;
  } | null;
  includedPages: {
    id?: string;
    name: string;
  }[];
  additionalPages: {
    id?: string;
    name: string;
    price: number;
  }[];
  customAdditionalPages: {
    title: string;
    description: string;
  }[];
  paymentSystems: {
    id?: string;
    name: string;
    price: number;
  }[];
  proServices: {
    id?: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  submittedAt: string;
}

// Save quote request to Firebase
export const saveQuoteRequest = async (quoteData: QuoteRequest) => {
  try {
    const docRef = await addDoc(collection(db, 'quoteRequests'), {
      ...quoteData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving quote request:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get all quote requests (for admin dashboard)
export const getQuoteRequests = async () => {
  try {
    const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const requests: any[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};