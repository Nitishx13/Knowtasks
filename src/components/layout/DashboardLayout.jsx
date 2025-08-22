import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/config';
import { Button } from '@components/ui/Button';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const isActive = (path) => {
    return router.pathname === path ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card shadow-lg fixed h-full border-r border-border transition-all duration-300 ease-in-out z-20`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg border border-white/70 shadow-sm">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800"></div>
              
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
                <span className="text-foreground font-semibold text-lg">Knowtasks</span>
                <span className="text-[8px] bg-gradient-to-r from-white to-gray-400 inline-block text-transparent bg-clip-text font-bold tracking-wider">PREMIUM</span>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
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
                isActive('/dashboard') === 'bg-primary/10 text-primary' 
                  ? "bg-white/10 text-white" 
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/research" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive('/dashboard/research') === 'bg-primary/10 text-primary'
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Research</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/summarize" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive('/dashboard/summarize') === 'bg-primary/10 text-primary'
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Summarize</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/library" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive('/dashboard/library') === 'bg-primary/10 text-primary'
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Library</span>}
              </Link>
            </li>
            <li className="pt-6">
              <Link href="/dashboard/settings" className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive('/dashboard/settings') === 'bg-primary/10 text-primary'
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
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
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="bg-card shadow-md p-4 flex justify-between items-center border-b border-border sticky top-0 z-10">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">

            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-4 w-4 bg-white rounded-full flex items-center justify-center text-xs text-black">2</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 mr-2 flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">User Name</p>
                <p className="text-xs bg-gradient-to-r from-white to-gray-400 inline-block text-transparent bg-clip-text font-medium">Premium</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-700 flex items-center justify-center text-black font-medium">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-background min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;