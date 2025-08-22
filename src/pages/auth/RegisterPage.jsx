import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [phoneAuth, setPhoneAuth] = useState({
    phoneNumber: '',
    verificationCode: '',
    codeSent: false,
    loading: false,
    error: null
  });
  
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (authMethod === 'email') {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }
        
        // Email/password registration
        const response = await authService.register(formData.name, formData.email, formData.password);
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        console.log('Registration successful:', response.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else if (authMethod === 'phone' && phoneAuth.codeSent) {
        // Phone verification - in a real app, this would be implemented
        alert('Phone registration not implemented in this demo');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(typeof error === 'string' ? error : 'Registration failed. Please try again.');
    }
  };
  
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    if (!phoneAuth.phoneNumber) return;
    
    setPhoneAuth(prev => ({ ...prev, loading: true, error: null }));
    try {
      // In a real app, this would call an API endpoint
      // For this demo, we'll simulate success
      setTimeout(() => {
        setPhoneAuth(prev => ({ ...prev, codeSent: true, loading: false }));
      }, 1000);
    } catch (error) {
      console.error('Error sending code:', error);
      setPhoneAuth(prev => ({ ...prev, error: error.message || 'Failed to send code', loading: false }));
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      // In a real app, this would get a Google token and send it to the backend
      // For this demo, we'll simulate a successful response
      const response = await authService.googleLogin('mock-google-token');
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      console.log('Google sign in successful:', response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      alert(typeof error === 'string' ? error : 'Google sign in failed');
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-primary text-center">Knowtasks</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${authMethod === 'email' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${authMethod === 'phone' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Phone Number
          </button>
        </div>
        
        {authMethod === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign up
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={phoneAuth.codeSent ? handleSubmit : handleSendVerificationCode}>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                value={phoneAuth.phoneNumber}
                onChange={(e) => setPhoneAuth(prev => ({ ...prev, phoneNumber: e.target.value }))}
                disabled={phoneAuth.codeSent}
              />
            </div>
            
            {phoneAuth.codeSent && (
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="123456"
                  value={phoneAuth.verificationCode}
                  onChange={(e) => setPhoneAuth(prev => ({ ...prev, verificationCode: e.target.value }))}
                />
              </div>
            )}
            
            {phoneAuth.error && (
              <div className="text-red-500 text-sm">{phoneAuth.error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={phoneAuth.loading}
              >
                {phoneAuth.loading ? 'Processing...' : phoneAuth.codeSent ? 'Verify Code' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        )}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-primary">
            Already have an account? Sign in
          </Link>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;