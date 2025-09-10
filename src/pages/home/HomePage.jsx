import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

const HomePage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div>

      {/* Enhanced Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Dynamic background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          style={{ y: y2 }}
        />
        
        {/* Interactive cursor effect */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        <div className="container max-w-5xl px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 px-5 py-2 bg-white text-black rounded-lg shadow-sm">
              <p className="text-sm font-semibold tracking-widest">KNOWTASKS</p>
            </div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Knowledge into
              <br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Smart Notes
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 mb-8 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Harness the power of AI to instantly convert any document, textbook, or research paper into organized, intelligent notes. Save hours of reading time while improving comprehension and retention.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {['IIT-JEE', 'NEET', 'Digital Skills', 'Classes 9-12', 'Graduation'].map((tag, index) => (
                <motion.span 
                  key={tag}
                  className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="px-12 py-6 text-base md:text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                  <Link href="/dashboard">
                    <span className="flex items-center justify-center gap-3">
                      🚀 START CREATING NOTES
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="px-12 py-6 text-base md:text-lg font-bold rounded-xl border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                  <Link href="#features">
                    <span className="flex items-center justify-center gap-3">
                      ✨ EXPLORE FEATURES
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-8 text-sm font-medium text-gray-400 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free to start
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant setup
              </span>
            </motion.div>
            
            {/* Enhanced Demo Section */}
            <motion.div 
              className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center px-6 border-b border-white/10">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-black/20 text-xs text-white flex items-center font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    knowtasks.ai
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-8 px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-lg">📄 Document Input</h3>
                      <span className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full font-medium">UPLOAD</span>
                    </div>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 bg-white/5 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                      <div className="text-center">
                        <motion.div 
                          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </motion.div>
                        <p className="text-white font-medium mb-2">Drop your PDF, DOCX, or TXT file</p>
                        <p className="text-gray-400 text-sm mb-4">Or paste text directly</p>
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium border border-white/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Select File
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-lg">🧠 AI-Generated Notes</h3>
                      <span className="text-xs px-3 py-1 bg-green-500 text-white rounded-full font-medium">READY</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="space-y-3">
                        {[
                          { width: 'w-full', delay: 2.0 },
                          { width: 'w-5/6', delay: 2.2 },
                          { width: 'w-full', delay: 2.4 },
                          { width: 'w-4/6', delay: 2.6 },
                          { width: 'w-5/6', delay: 2.8 },
                          { width: 'w-3/4', delay: 3.0 }
                        ].map((line, index) => (
                          <motion.div 
                            key={index}
                            className={`h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-sm ${line.width}`}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.5, delay: line.delay }}
                          />
                        ))}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Generated in 3.2s
                          </div>
                          <motion.button 
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📥 Export PDF
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40"></div>
        
        <div className="container max-w-7xl px-4 sm:px-6 mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full backdrop-blur-md border border-indigo-200">
              <p className="text-sm font-bold tracking-wider text-indigo-800">🚀 POWERFUL FEATURES</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Everything you need for
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Smart Learning
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              Discover the advanced AI capabilities that make Knowtasks the ultimate study companion for students worldwide.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI-Powered Summarization",
                description: "Advanced algorithms analyze your documents and extract key concepts, creating comprehensive summaries that capture the essence of any material.",
                color: "from-blue-500 to-cyan-500",
                delay: 0.2
              },
              {
                icon: "⚡",
                title: "Lightning Fast Processing",
                description: "Upload documents up to 50MB and get intelligent notes in seconds. Our optimized AI processes even complex academic papers instantly.",
                color: "from-purple-500 to-pink-500",
                delay: 0.4
              },
              {
                icon: "📚",
                title: "Multi-Format Support",
                description: "Works with PDFs, Word documents, text files, and more. Paste text directly or upload files - we handle all popular formats seamlessly.",
                color: "from-green-500 to-teal-500",
                delay: 0.6
              },
              {
                icon: "🎯",
                title: "Subject-Specific Optimization",
                description: "Tailored for IIT-JEE, NEET, digital skills, and academic subjects. Our AI understands context and generates relevant study materials.",
                color: "from-orange-500 to-red-500",
                delay: 0.8
              },
              {
                icon: "🔍",
                title: "Smart Search & Organization",
                description: "Find any note instantly with powerful search. Organize by subject, date, or custom tags. Your knowledge, perfectly structured.",
                color: "from-indigo-500 to-purple-500",
                delay: 1.0
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description: "Monitor your learning journey with detailed analytics. Track reading time, note creation, and study patterns to optimize your workflow.",
                color: "from-cyan-500 to-blue-500",
                delay: 1.2
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  
                  <div className={`mt-6 w-12 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200/30 transition-all duration-300 hover:-translate-y-1 text-lg">
              🎉 Try All Features Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Library Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-blue-50 to-white text-gray-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/50 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-100/50 rounded-full blur-sm -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-teal-100/50 rounded-full blur-md -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full backdrop-blur-md border border-blue-200">
              <p className="text-xs font-bold tracking-wider text-blue-800">YOUR KNOWLEDGE HUB</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
              Your <span className="relative">Personal
                <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </span> Library
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">Organize your learning journey with our intelligent note system. Access all your subjects in one beautiful, intuitive interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Biology Card */}
            <div className="group relative bg-white p-6 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mr-4 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">Biology 101</h3>
                      <p className="text-sm text-gray-500">12 chapters</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium border border-green-200">Active</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mb-5">
                  <div className="h-1.5 bg-green-500 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last updated: 2 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* World History Card */}
            <div className="group relative bg-white p-6 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">World History</h3>
                      <p className="text-sm text-gray-500">8 chapters</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-200">In Progress</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mb-5">
                  <div className="h-1.5 bg-blue-500 rounded-full w-1/2"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last updated: 5 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Economics Card */}
            <div className="group relative bg-white p-6 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mr-4 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">Economics</h3>
                      <p className="text-sm text-gray-500">5 chapters</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full font-medium border border-amber-200">New</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mb-5">
                  <div className="h-1.5 bg-amber-500 rounded-full w-1/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last updated: 1 week ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Computer Science Card */}
            <div className="group relative bg-white p-6 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl hover:shadow-blue-100/30 hover:border-blue-200 transition-all duration-300 overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mr-4 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">Computer Science</h3>
                      <p className="text-sm text-gray-500">10 chapters</p>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-medium border border-purple-200">Popular</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mb-5">
                  <div className="h-1.5 bg-purple-500 rounded-full w-4/5"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Last updated: 3 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Add New Subject Card */}
            <div className="group relative bg-white p-6 rounded-2xl border border-dashed border-blue-200 shadow-lg hover:shadow-xl hover:shadow-blue-100/20 hover:border-blue-300 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-xl mb-2">Add New Subject</h3>
              <p className="text-gray-600 text-sm mb-4">Create a new collection for your study materials</p>
              <button className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Create New</button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-300 hover:-translate-y-1">
              Explore Your Library
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Made To Be Simple Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute left-0 top-1/4 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-1/3 h-1/3 bg-purple-100/30 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full backdrop-blur-md border border-blue-200">
              <p className="text-xs font-bold tracking-wider text-blue-800">EFFORTLESS WORKFLOW</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">Smart Notes <span className="relative">Made Simple
              <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </span></h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">Our AI-powered platform transforms any document into intelligent, organized notes so you can focus on what matters most - understanding and learning.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 z-0"></div>
            
            {/* Upload Step */}
            <div className="group bg-white backdrop-blur-md p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl hover:shadow-blue-100/30 hover:border-blue-300 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-blue-600 transition-all duration-300">1</div>
              <h3 className="font-bold text-gray-800 text-xl mb-4">Upload</h3>
              <p className="text-gray-600 mb-6">Upload any document, textbook, or article in seconds.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-400 opacity-50 group-hover:text-blue-500 group-hover:opacity-70 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            
            {/* Process Step */}
            <div className="group bg-white backdrop-blur-md p-8 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl hover:shadow-purple-100/30 hover:border-purple-300 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-purple-600 transition-all duration-300">2</div>
              <h3 className="font-bold text-gray-800 text-xl mb-4">Generate</h3>
              <p className="text-gray-600 mb-6">Our AI creates smart, organized notes with key concepts highlighted.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-purple-400 opacity-50 group-hover:text-purple-500 group-hover:opacity-70 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            
            {/* Study Step */}
            <div className="group bg-white backdrop-blur-md p-8 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl hover:shadow-green-100/30 hover:border-green-300 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-green-600 transition-all duration-300">3</div>
              <h3 className="font-bold text-gray-800 text-xl mb-4">Learn</h3>
              <p className="text-gray-600 mb-6">Review your smart notes with summaries, key points, and study guides.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-green-400 opacity-50 group-hover:text-green-500 group-hover:opacity-70 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600">
              Create Smart Notes Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Context Section */}
      <section className="py-16 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tailored for Your Educational Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our smart note-taking tool is designed to support students across different educational paths.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* IIT-JEE Card */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">IIT-JEE Preparation</h3>
              <p className="text-gray-700 mb-4">Master Physics, Chemistry, and Mathematics with our specialized note-taking tools designed for JEE aspirants.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Formula extraction & organization
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Problem-solving techniques
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Subject-specific revision plans
                </li>
              </ul>
              <Link href="/dashboard?context=iit" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start IIT-JEE Prep
              </Link>
            </div>
            
            {/* NEET Card */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-3">NEET Preparation</h3>
              <p className="text-gray-700 mb-4">Excel in Biology, Physics, and Chemistry with our comprehensive note-taking system for medical aspirants.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Biological diagrams & annotations
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Medical terminology extraction
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Structured biology study plans
                </li>
              </ul>
              <Link href="/dashboard?context=neet" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Start NEET Prep
              </Link>
            </div>
            
            {/* Digital Skills Card */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">Digital Skills Learning</h3>
              <p className="text-gray-700 mb-4">Learn programming, web development, and data analysis with our specialized note-taking tools for tech learners.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Code snippet organization
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Technical concept extraction
                </li>
                <li className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Project-based learning paths
                </li>
              </ul>
              <Link href="/dashboard?context=digital" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Start Digital Learning
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white border-t border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-blue-100/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute right-1/4 bottom-1/3 w-64 h-64 bg-purple-100/30 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Loved by <span className="relative">Students
              <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Knowtasks is popular among students worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-blue-100 hover:border-blue-200 shadow-md hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center mr-4 border border-blue-200 group-hover:border-blue-300 transition-all duration-300">
                  <span className="text-white font-bold">MP</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Md. Shah Paran</h4>
                  <p className="text-sm text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Knowtasks's seamless experience and intuitive design make it my top pick for creative projects. It's a game changer that continuously boosts my productivity—highly recommended!"</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-purple-100 hover:border-purple-200 shadow-md hover:shadow-lg hover:shadow-purple-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-purple-500 flex items-center justify-center mr-4 border border-purple-200 group-hover:border-purple-300 transition-all duration-300">
                  <span className="text-white font-bold">SM</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Steve Morin</h4>
                  <p className="text-sm text-gray-600">Graduate Student</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Love how Knowtasks accelerates my development and that of my teams. The AI-generated notes are comprehensive and save me hours of reading time."</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-green-100 hover:border-green-200 shadow-md hover:shadow-lg hover:shadow-green-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center mr-4 border border-green-200 group-hover:border-green-300 transition-all duration-300">
                  <span className="text-white font-bold">AK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Aldino Kemal</h4>
                  <p className="text-sm text-gray-600">PhD Candidate</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Knowtasks, the real AI partner! It's been such a huge help in getting my research tasks done—no stress reading at all. Plus, I've got to say, this is the best note-taking app I've ever used!"</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600">
              Try Knowtasks Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-blue-100/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute left-1/4 bottom-1/3 w-64 h-64 bg-purple-100/30 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">What Our Users <span className="relative">Say
              <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of students improving their learning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-blue-100 hover:border-blue-200 shadow-md hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center mr-4 border border-blue-200 group-hover:border-blue-300 transition-all duration-300">
                  <span className="text-white font-bold">J</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Jamie L.</h4>
                  <p className="text-sm text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Knowtasks has completely transformed how I study. I can upload complex CS textbook chapters and get clear, concise notes that help me understand difficult concepts."</p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-green-100 hover:border-green-200 shadow-md hover:shadow-lg hover:shadow-green-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center mr-4 border border-green-200 group-hover:border-green-300 transition-all duration-300">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Michael T.</h4>
                  <p className="text-sm text-gray-600">Medical Student</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"As a med student, I have mountains of reading. Knowtasks's smart notes feature extracts key concepts from dense medical texts and organizes them perfectly. The AI-generated summaries save me hours of work."</p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="group bg-white backdrop-blur-sm rounded-xl p-8 border border-purple-100 hover:border-purple-200 shadow-md hover:shadow-lg hover:shadow-purple-100/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-purple-500 flex items-center justify-center mr-4 border border-purple-200 group-hover:border-purple-300 transition-all duration-300">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Sarah K.</h4>
                  <p className="text-sm text-gray-600">History Major</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"I was skeptical about AI for humanities subjects, but Knowtasks's smart notes actually understand context and themes in historical texts. The AI-generated notes capture nuances I might miss myself."</p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1">
              Start Using Knowtasks Today
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black border-t border-gray-800 relative overflow-hidden">
        <div className="absolute left-1/3 top-1/2 w-96 h-96 bg-white/5 rounded-full blur-[150px] -z-10"></div>
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Ready for <span className="relative">Smart Notes
            <span className="absolute bottom-1 left-0 w-full h-1 bg-white"></span>
          </span> that work for you?</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300 font-medium">Join thousands of students who save time and improve productivity with AI-generated smart notes</p>
          
          {/* Educational Context CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link href="/dashboard?context=iit" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1 text-base">
              IIT-JEE Prep
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </Link>
            <Link href="/dashboard?context=neet" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 hover:-translate-y-1 text-base">
              NEET Prep
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link href="/dashboard?context=digital" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all duration-300 hover:-translate-y-1 text-base">
              Digital Skills
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all duration-300 hover:-translate-y-1 text-base">
              General Notes
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1 text-lg">
              Create Smart Notes
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1 text-lg">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <p className="text-sm mt-6 text-gray-400 font-medium">No credit card required</p>
        </div>
      </section>
      
      
     

    </div>
  );
};

export default HomePage;