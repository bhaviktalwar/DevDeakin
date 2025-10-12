// Test your new Firebase setup
import { auth, db } from './init-firebase';

// Test Firebase connection
console.log('Testing Firebase connection...');
console.log('Auth instance:', auth);
console.log('DB instance:', db);
console.log('Project ID:', auth.app.options.projectId);

// Check if authentication is working
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.email);
  } else {
    console.log('No user is signed in');
  }
});

export { auth, db };