// Test Firebase connection
import { auth, db } from './init-firebase';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

console.log('Testing Firebase connection...');
console.log('Auth instance:', auth);
console.log('DB instance:', db);
console.log('Auth app:', auth.app);
console.log('Auth config:', auth.config);

// Test if we can access the auth instance
try {
  console.log('Current user:', auth.currentUser);
  console.log('Firebase Auth initialized successfully!');
} catch (error) {
  console.error('Firebase Auth initialization error:', error);
}

export { auth, db };