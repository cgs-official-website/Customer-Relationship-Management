import { db } from '../firebase/config';
import { collection, getDocs, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const getUsers = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, data);
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
