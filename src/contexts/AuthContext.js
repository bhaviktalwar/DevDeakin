import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../init-firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // Firebase Auth signup function
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Firebase Auth login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Firebase Auth sign out function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Fetch user details from Firestore
  const fetchUserDetails = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          // Fetch additional user details from Firestore
          const details = await fetchUserDetails(user.uid);
          setUserDetails(details);
        } else {
          setCurrentUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(null);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    userDetails,
    login,
    signup,
    logout,
    loading
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}