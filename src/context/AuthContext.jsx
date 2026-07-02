import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // Auto-create admin account if it's the hardcoded credentials and doesn't exist
      const isAdmin1 = email === 'admin@zuna.com' && password === 'Cgs@001a';
      const isAdmin2 = email === 'admin@zunacrm.com' && password === 'Zunacrm@123';
      
      if ((isAdmin1 || isAdmin2) && 
          (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password')) {
        console.log("Auto-creating admin account...");
        return await signup(email, password, 'Admin');
      }
      throw error;
    }
  };

  // Signup function
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create custom user profile
    const isAdmin = email === 'admin@zuna.com' || email === 'admin@zunacrm.com';
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      role: isAdmin ? 'admin' : 'employee'
    });
    return userCredential;
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user profile from Firestore if needed
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Force admin role for authorized admin emails to fix accounts created normally
            const isAdminEmail = user.email === 'admin@zuna.com' || user.email === 'admin@zunacrm.com';
            if (isAdminEmail && data.role !== 'admin') {
              data.role = 'admin';
              await setDoc(doc(db, 'users', user.uid), { role: 'admin' }, { merge: true });
            }
            
            setCurrentUser({ ...user, ...data });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateCurrentUser: (newData) => setCurrentUser(prev => ({ ...prev, ...newData }))
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
