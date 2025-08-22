import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import Header from './Header';

const MainLayout = ({ children }) => {

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-gray-50 rounded-full blur-[80px] -z-10 opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-gray-50 rounded-full blur-[80px] -z-10 opacity-70"></div>
        
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="md:pr-8">
              <Link to="/" className="flex items-center mb-4 group">
                <div className="relative w-10 h-10 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110 overflow-hidden rounded-md border-2 border-black">
                  {/* Black and white design */}
                  <div className="absolute top-0 w-full h-1/2 bg-black"></div>
                  <div className="absolute bottom-0 w-full h-1/2 bg-white flex items-center justify-center">
                    <span className="text-black text-[12px] font-bold">K</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-black">Knowtasks</span>
                  <span className="text-[10px] text-gray-500">Minimalist Design</span>
                </div>
              </Link>
              <p className="text-sm text-gray-600 mb-4">Smart note-taking and summarization for students and professionals.</p>
              <div className="mt-6">
                <form className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-200 text-sm"
                    />
                  </div>
                  <Button className="bg-black hover:bg-black/90 text-white shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm rounded-md">
                    SUBSCRIBE
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2">Get product updates and news. No spam.</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-black font-bold mb-4 text-base uppercase tracking-wide">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/features" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/testimonials" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-black font-bold mb-4 text-base uppercase tracking-wide">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-black font-bold mb-4 text-base uppercase tracking-wide">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/privacy" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-500 hover:text-black transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-black mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Notedly.ai. All rights reserved.</p>
            <div className="flex space-x-5 mt-6 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;