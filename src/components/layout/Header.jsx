import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@components/ui/Button';
import { Menu } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 10;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrolled]);

  return (
    <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-1 md:py-2 bg-background/95 backdrop-blur-md shadow-sm' : 'py-2 md:py-4 bg-background/80 backdrop-blur-sm'}`}>
      <div className="container px-3 md:px-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo Design */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center mr-2 md:mr-3 transition-transform duration-300 group-hover:scale-110 overflow-hidden rounded-lg border-2 border-black shadow-md">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700"></div>
                
                {/* Logo symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-base md:text-xl font-bold transform -rotate-12 select-none">K</span>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-2 md:w-3 h-2 md:h-3 bg-white rounded-full transform translate-x-1 -translate-y-1 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full transform -translate-x-1 translate-y-1 opacity-70"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 inline-block text-transparent bg-clip-text transition-all duration-300">Knowtasks</span>
                <span className="text-[8px] md:text-xs text-muted-foreground tracking-wider hidden sm:inline-block">CAPTURE • ORGANIZE • FOCUS</span>
              </div>
            </Link>
            {/* Premium Badge */}
            <div className="ml-2 md:ml-3 px-1.5 md:px-2 py-0.5 bg-gradient-to-r from-orange-400 to-orange-600 border border-orange-500 rounded-full flex items-center shadow-sm">
              <span className="text-white text-[8px] md:text-[10px] font-medium">PREMIUM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard">
              <Button className="bg-orange-500 text-white hover:bg-orange-600 font-bold px-6 py-2 rounded-xl shadow-md group">
                <span className="flex items-center">
                  Go to Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </Link>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-accent relative group overflow-hidden rounded-full border border-gray-200">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-orange-500/20 to-orange-500/5 rounded-full"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;