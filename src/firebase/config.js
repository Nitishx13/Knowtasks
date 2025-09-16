// Firebase configuration
// Note: In a real application, you would need to install the firebase package
// and use actual Firebase credentials

// This is a mock implementation for demonstration purposes
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Mock Firebase Auth implementation
const auth = {
  // Google Sign In
  signInWithGoogle: async () => {
    console.log('Sign in with Google');
    // In a real implementation, this would use Firebase's signInWithPopup
    return {
      user: {
        uid: 'google-user-id',
        email: 'user@example.com',
        displayName: 'Google User',
        photoURL: 'https://via.placeholder.com/150'
      }
    };
  },
  
  // Phone Number Sign In
  // Step 1: Send verification code
  sendSignInLinkToPhoneNumber: async (phoneNumber) => {
    console.log(`Sending verification code to ${phoneNumber}`);
    // In a real implementation, this would send an SMS
    return true;
  },
  
  // Step 2: Verify code
  verifyPhoneNumber: async (phoneNumber, code) => {
    console.log(`Verifying code ${code} for ${phoneNumber}`);
    // In a real implementation, this would verify the code
    if (code === '123456') {
      return {
        user: {
          uid: 'phone-user-id',
          phoneNumber: phoneNumber
        }
      };
    } else {
      throw new Error('Invalid verification code');
    }
  },
  
  // Email/Password Sign In
  signInWithEmailAndPassword: async (email, password) => {
    console.log(`Sign in with email: ${email}`);
    // In a real implementation, this would authenticate with Firebase
    if (password === 'password123') {
      return {
        user: {
          uid: 'email-user-id',
          email: email
        }
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },
  
  // Email/Password Registration
  createUserWithEmailAndPassword: async (email, password) => {
    console.log(`Register with email: ${email}`);
    // In a real implementation, this would register with Firebase
    return {
      user: {
        uid: 'new-user-id',
        email: email
      }
    };
  },
  
  // Sign Out
  signOut: async () => {
    console.log('Sign out');
    // In a real implementation, this would sign out from Firebase
    return true;
  }
};

export { auth };
export default firebaseConfig;