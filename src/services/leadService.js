import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';

const LEADS_COLLECTION = 'leads';

// Add a new lead
export const addLead = async (leadData, userId) => {
  try {
    const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
      ...leadData,
      currentStatus: 'New Lead',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      userId: userId,
      statusHistory: [
        {
          status: 'New Lead',
          updatedBy: userId,
          timestamp: new Date().toISOString()
        }
      ]
    });
    return { id: docRef.id, ...leadData };
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
};

// Batch add leads from Excel
export const addLeadsBatch = async (leadsArray, userId) => {
  // In a real production app for thousands of records, we'd use a Firestore batch.
  // Here we do them individually but await all, for simplicity unless over 500 limit.
  const promises = leadsArray.map(lead => addLead(lead, userId));
  return await Promise.all(promises);
};

// Get leads based on user role
export const getLeads = async (currentUser) => {
  try {
    let q;
    if (currentUser?.role === 'admin') {
      // Admins see all leads
      q = query(collection(db, LEADS_COLLECTION));
    } else if (currentUser?.uid) {
      // Employees see only their own leads
      q = query(
        collection(db, LEADS_COLLECTION), 
        where('userId', '==', currentUser.uid)
      );
    } else {
      return []; // Fallback if no user is provided
    }

    const querySnapshot = await getDocs(q);
    const leads = [];
    querySnapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort on the client to avoid Firestore composite index requirement
    leads.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    
    return leads;
  } catch (error) {
    console.error("Error getting leads:", error);
    throw error;
  }
};

// Update lead status
export const updateLeadStatus = async (leadId, newStatus, currentHistory, userId) => {
  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    
    const newHistoryEntry = {
      status: newStatus,
      updatedBy: userId,
      timestamp: new Date().toISOString()
    };

    await updateDoc(leadRef, {
      currentStatus: newStatus,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      statusHistory: [...(currentHistory || []), newHistoryEntry]
    });
    
    return true;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

// Update lead details
export const updateLeadDetails = async (leadId, updatedData, userId) => {
  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    await updateDoc(leadRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
    return true;
  } catch (error) {
    console.error("Error updating lead details:", error);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (leadId) => {
  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    await deleteDoc(leadRef);
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

// Clear entire leads DB (Admin only utility)
export const deleteAllLeads = async () => {
  try {
    const q = query(collection(db, LEADS_COLLECTION));
    const snapshot = await getDocs(q);
    const promises = [];
    snapshot.forEach((document) => {
      promises.push(deleteDoc(doc(db, LEADS_COLLECTION, document.id)));
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error deleting all leads:", error);
    throw error;
  }
};
