import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
    console.log('Initializing socket with URL:', socketUrl);
    socket = io(`${socketUrl}/auth`, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    // Set up event listeners for connection status
    socket.on('connect', () => {
      console.log('Connected to authentication socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
    });
  }

  return socket;
};

export const connectSocket = () => {
  const socket = initializeSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

// Authentication methods
export const socketAuth = {
  // Login with real-time updates
  login: (credentials, callbacks = {}) => {
    const socket = connectSocket();
    
    // Set up event listeners for login response
    if (callbacks.onSuccess) {
      socket.once('login_success', callbacks.onSuccess);
    }
    
    if (callbacks.onError) {
      socket.once('login_error', callbacks.onError);
    }
    
    // Emit login event with credentials
    socket.emit('login', credentials);
    
    // Return cleanup function
    return () => {
      socket.off('login_success');
      socket.off('login_error');
    };
  },
  
  // Register with real-time updates
  register: (userData, callbacks = {}) => {
    const socket = connectSocket();
    
    // Set up event listeners for registration response
    if (callbacks.onSuccess) {
      socket.once('register_success', callbacks.onSuccess);
    }
    
    if (callbacks.onError) {
      socket.once('register_error', callbacks.onError);
    }
    
    // Emit register event with user data
    socket.emit('register', userData);
    
    // Return cleanup function
    return () => {
      socket.off('register_success');
      socket.off('register_error');
    };
  },
  
  // Check authentication status
  checkAuth: (token, callback) => {
    const socket = connectSocket();
    
    // Set up event listener for auth status
    if (callback) {
      socket.once('auth_status', callback);
    }
    
    // Emit check_auth event with token
    socket.emit('check_auth', token);
    
    // Return cleanup function
    return () => {
      socket.off('auth_status');
    };
  },
  
  // Logout with real-time updates
  logout: (userId, callback) => {
    const socket = connectSocket();
    
    // Set up event listener for logout response
    if (callback) {
      socket.once('logout_success', callback);
    }
    
    // Emit logout event with user ID
    socket.emit('logout', userId);
    
    // Return cleanup function
    return () => {
      socket.off('logout_success');
    };
  },
  
  // Subscribe to user activity (for admin users)
  subscribeToUserActivity: (callback) => {
    const socket = connectSocket();
    
    // Set up event listener for user activity
    socket.on('user_activity', callback);
    
    // Return cleanup function
    return () => {
      socket.off('user_activity', callback);
    };
  }
};

export default socketAuth;