import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@components/ui/Button';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check authentication based on route
  useEffect(() => {
    const checkAuth = () => {
      const currentPath = router.pathname;

      // For SuperAdmin routes
      if (currentPath.startsWith('/admin/')) {
        const isAuthenticated = localStorage.getItem('superadmin_authenticated');
        if (!isAuthenticated) {
          router.push('/admin/login');
          return;
        }
      }

      // For Mentor routes
      if (currentPath.startsWith('/mentor/')) {
        const isAuthenticated = localStorage.getItem('mentor_authenticated');
        if (!isAuthenticated) {
          router.push('/mentor/login');
          return;
        }
      }

      // For regular user routes, check Clerk authentication
      if (currentPath.startsWith('/dashboard') && !currentPath.includes('/admin/') && !currentPath.includes('/mentor/')) {
        if (isLoaded && !user) {
          router.push('/login');
          return;
        }
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, [router.pathname, isLoaded, user, router]);

  const isActive = (path) => {
    return router.pathname === path ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground';
  };

  // Show loading state while authentication is being checked
  if (!authChecked || (!isLoaded && router.pathname.startsWith('/dashboard') && !router.pathname.includes('/admin/') && !router.pathname.includes('/mentor/'))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : sidebarCollapsed ? 'w-16' : 'w-64'} 
        ${isMobile ? 'fixed inset-y-0 left-0 w-64 z-50' : 'fixed h-full border-r border-gray-200'} 
        bg-white shadow-lg transition-all duration-300 ease-in-out z-20`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"></div>
              
              {/* Logo symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold transform -rotate-12 select-none">K</span>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full transform translate-x-0.5 -translate-y-0.5 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-0.5 translate-y-0.5 opacity-70"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex flex-col">
                <span className="text-gray-900 font-semibold text-lg">Knowtasks</span>
                <span className="text-[8px] bg-gradient-to-r from-gray-600 to-gray-400 inline-block text-transparent bg-clip-text font-bold tracking-wider">PREMIUM</span>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            variant="ghost" 
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </Button>
        </div>
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                router.pathname === '/dashboard' || router.pathname === '/dashboard/'
                  ? "bg-gray-100 text-gray-900" 
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            
            {/* Admin-specific navigation */}
            {router.pathname.startsWith('/admin/') && (
              <li>
                <Link href="/admin/mentor-applications" className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  router.pathname === '/admin/mentor-applications'
                    ? "bg-gray-100 text-gray-900" 
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                )}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3">Mentor Applications</span>}
                </Link>
              </li>
            )}
            
            <li>
              <Link href="/dashboard/library" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                router.pathname.startsWith('/dashboard/library')
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Knowledge Hub</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/data" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                router.pathname.startsWith('/dashboard/data')
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              )}>
                <svg xmlns="http://www/w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">My Notes</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/summarize" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                router.pathname === '/dashboard/summarize'
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Upload File</span>}
              </Link>
            </li>
            {/* Upload page hidden */}
            <li className="pt-6">
              <Link href="/dashboard/settings" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                router.pathname === '/dashboard/settings'
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
          {/* Mobile menu toggle */}
          {isMobile && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm active:scale-95 transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">2</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              {/* Sign Out Button - Different logic for different auth types */}
              {router.pathname.startsWith('/admin/') ? (
                <Button 
                  variant="outline" 
                  className="text-sm font-medium px-4 py-2 mr-2 flex items-center shadow-sm hover:shadow-md transition-all border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    localStorage.removeItem('superadmin_authenticated');
                    localStorage.removeItem('superadmin_email');
                    localStorage.removeItem('superadmin_login_time');
                    router.push('/admin/login');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              ) : router.pathname.startsWith('/mentor/') ? (
                <Button 
                  variant="outline" 
                  className="text-sm font-medium px-4 py-2 mr-2 flex items-center shadow-sm hover:shadow-md transition-all border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    localStorage.removeItem('mentor_authenticated');
                    localStorage.removeItem('mentor_email');
                    localStorage.removeItem('mentor_login_time');
                    router.push('/mentor/login');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              ) : (
                <SignOutButton>
                  <Button 
                    variant="outline" 
                    className="text-sm font-medium px-4 py-2 mr-2 flex items-center shadow-sm hover:shadow-md transition-all border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </Button>
                </SignOutButton>
              )}
              
              {/* User Profile - Different display for different auth types */}
              <div className="hidden md:block text-right">
                {router.pathname.startsWith('/admin/') ? (
                  <>
                    <p className="text-sm font-medium text-gray-900">SuperAdmin</p>
                    <p className="text-xs text-gray-500 font-medium">System Administrator</p>
                  </>
                ) : router.pathname.startsWith('/mentor/') ? (
                  <>
                    <p className="text-sm font-medium text-gray-900">Mentor</p>
                    <p className="text-xs text-gray-500 font-medium">Educational Guide</p>
                  </>
                ) : user ? (
                  <>
                    <p className="text-sm font-medium text-gray-900">{user.firstName || user.emailAddresses[0]?.emailAddress}</p>
                    <p className="text-xs text-gray-500 font-medium">Premium</p>
                  </>
                ) : null}
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                {router.pathname.startsWith('/admin/') ? 'SA' : 
                 router.pathname.startsWith('/mentor/') ? 'M' : 
                 user ? (user.firstName ? user.firstName[0].toUpperCase() : user.emailAddresses[0]?.emailAddress[0].toUpperCase()) : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 min-h-screen pb-20 md:pb-6">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
            <div className="flex justify-around items-center h-16 px-2">
              <Link href="/dashboard" className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                router.pathname === '/dashboard' || router.pathname === '/dashboard/' ? "text-blue-600" : "text-gray-500"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1 font-medium">Home</span>
              </Link>
              
              <Link href="/dashboard/data" className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                router.pathname.startsWith('/dashboard/data') ? "text-blue-600" : "text-gray-500"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs mt-1 font-medium">Data</span>
              </Link>
              
              
              <Link href="/dashboard/summarize" className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                router.pathname.startsWith('/dashboard/summarize') ? "text-blue-600" : "text-gray-500"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs mt-1 font-medium">Upload</span>
              </Link>
              
              <Link href="/dashboard/library" className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                router.pathname.startsWith('/dashboard/library') ? "text-blue-600" : "text-gray-500"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs mt-1 font-medium">Hub</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile sidebar overlay and menu */}
      {isMobile && mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-4 px-3">
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    router.pathname === '/dashboard' || router.pathname === '/dashboard/'
                      ? "bg-gray-100 text-gray-900" 
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="ml-3">Dashboard</span>
                  </Link>
                </li>
                
                {/* Admin-specific navigation for mobile */}
                {router.pathname.startsWith('/admin/') && (
                  <li>
                    <Link href="/admin/mentor-applications" className={cn(
                      "flex items-center p-3 rounded-lg transition-colors",
                      router.pathname === '/admin/mentor-applications'
                        ? "bg-gray-100 text-gray-900" 
                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    )}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                      <span className="ml-3">Mentor Applications</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/dashboard/library" className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    router.pathname.startsWith('/dashboard/library')
                      ? "bg-gray-100 text-gray-900"
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-3">Knowledge Hub</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/summarize" className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    router.pathname.startsWith('/dashboard/summarize')
                      ? "bg-gray-100 text-gray-900"
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="ml-3">Upload File</span>
                  </Link>
                </li>
                <li className="pt-6">
                  <Link href="/dashboard/settings" className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    router.pathname.startsWith('/dashboard/settings')
                      ? "bg-gray-100 text-gray-900"
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="ml-3">Settings</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;