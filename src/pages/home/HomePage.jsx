import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

const HomePage = () => {
  return (
    <div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Simplified background effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white -z-10"></div>
        
        <div className="container max-w-5xl px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 px-5 py-2 bg-black text-white rounded-lg shadow-sm">
              <p className="text-sm font-semibold tracking-wide">KNOWTASKS</p>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-black leading-tight tracking-tight">
              AI-Generated<br className="hidden sm:block"/>
              <span className="border-b-4 border-black pb-1">Smart Notes</span>
            </h1>
            
            <p className="text-gray-700 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-medium">Transform any document into comprehensive, intelligent notes with our AI technology. Get organized summaries, key points, and study materials instantly.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <Button asChild size="lg" className="px-10 py-6 text-base md:text-lg font-bold rounded-md hover:translate-y-[-2px] transition-all duration-300 shadow-md bg-black text-white">
                <Link href="/dashboard">
                  <span className="flex items-center justify-center gap-2">
                    CREATE SMART NOTES
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-10 py-6 text-base md:text-lg font-bold rounded-md border-2 border-black text-black hover:bg-gray-100">
                <Link href="#how-it-works">
                  <span className="flex items-center justify-center gap-2">
                    SEE HOW IT WORKS
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </Link>
              </Button>
            </div>
            
            <p className="text-sm font-medium text-gray-500 mb-16">✓ No credit card required &nbsp;&nbsp; ✓ 14-day free trial &nbsp;&nbsp; ✓ Cancel anytime</p>
            
            {/* Demo card with animation */}
            <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
              <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-0.5 rounded-sm bg-white/10 text-xs text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    NOTEDLY.AI
                  </div>
                </div>
              </div>
              
              <div className="pt-14 pb-6 px-6">
                <div className="flex gap-6 flex-col md:flex-row">
                  <div className="flex-1 border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-black text-sm uppercase tracking-wide">Document</h3>
                      <span className="text-xs px-2 py-0.5 bg-black text-white rounded-sm">INPUT</span>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center text-center bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-3 font-medium">Upload your textbook or article</p>
                      <Button variant="outline" size="sm" className="text-xs border-black text-black hover:bg-black hover:text-white transition-colors font-bold px-4 py-1">SELECT FILE</Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-black text-sm uppercase tracking-wide">Smart Notes</h3>
                      <span className="text-xs px-2 py-0.5 bg-black text-white rounded-sm">OUTPUT</span>
                    </div>
                    <div className="space-y-2.5 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="h-3 bg-gray-300 rounded-sm w-full"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-full"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-4/6"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-full"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded-sm w-3/6"></div>
                      <div className="flex justify-end mt-4">
                        <Button size="sm" className="text-xs bg-black text-white hover:bg-gray-800 font-bold px-4 py-1">EXPORT PDF</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-sm -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-md -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gray-800/30 rounded-full backdrop-blur-md border border-gray-700">
              <p className="text-xs font-bold tracking-wider text-white">YOUR KNOWLEDGE HUB</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Your <span className="relative">Personal
                <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-white to-gray-400"></span>
              </span> Library
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">Organize your learning journey with our intelligent note system. Access all your subjects in one beautiful, intuitive interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Biology Card */}
            <div className="group relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Biology 101</h3>
                      <p className="text-sm text-gray-300">12 chapters</p>
                    </div>
                  </div>
                  <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">Active</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full mb-5">
                  <div className="h-1.5 bg-white rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last updated: 2 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 group-hover:bg-white/20">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* World History Card */}
            <div className="group relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">World History</h3>
                      <p className="text-sm text-gray-300">8 chapters</p>
                    </div>
                  </div>
                  <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">In Progress</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full mb-5">
                  <div className="h-1.5 bg-white rounded-full w-1/2"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last updated: 5 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 group-hover:bg-white/20">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Economics Card */}
            <div className="group relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Economics</h3>
                      <p className="text-sm text-gray-300">5 chapters</p>
                    </div>
                  </div>
                  <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">New</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full mb-5">
                  <div className="h-1.5 bg-white rounded-full w-1/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last updated: 1 week ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 group-hover:bg-white/20">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Computer Science Card */}
            <div className="group relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-300 overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Computer Science</h3>
                      <p className="text-sm text-gray-300">10 chapters</p>
                    </div>
                  </div>
                  <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">Popular</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full mb-5">
                  <div className="h-1.5 bg-white rounded-full w-4/5"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last updated: 3 days ago</span>
                  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 group-hover:bg-white/20">View Notes</button>
                </div>
              </div>
            </div>
            
            {/* Add New Subject Card */}
            <div className="group relative bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-dashed border-gray-700 shadow-lg hover:shadow-xl hover:shadow-white/5 hover:border-gray-500 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Add New Subject</h3>
              <p className="text-gray-300 text-sm mb-4">Create a new collection for your study materials</p>
              <button className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300">Create New</button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1">
              Explore Your Library
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Made To Be Simple Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-black relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute left-0 top-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gray-800/30 rounded-full backdrop-blur-md border border-gray-700">
              <p className="text-xs font-bold tracking-wider text-white">EFFORTLESS WORKFLOW</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">Smart Notes <span className="relative">Made Simple
              <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-white to-gray-400"></span>
            </span></h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">Our AI-powered platform transforms any document into intelligent, organized notes so you can focus on what matters most - understanding and learning.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20 z-0"></div>
            
            {/* Upload Step */}
            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-white/20 transition-all duration-300">1</div>
              <h3 className="font-bold text-white text-xl mb-4">Upload</h3>
              <p className="text-gray-300 mb-6">Upload any document, textbook, or article in seconds.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-30 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            
            {/* Process Step */}
            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-white/20 transition-all duration-300">2</div>
              <h3 className="font-bold text-white text-xl mb-4">Generate</h3>
              <p className="text-gray-300 mb-6">Our AI creates smart, organized notes with key concepts highlighted.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-30 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            
            {/* Study Step */}
            <div className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-gray-500 transition-all duration-500 text-center relative z-10 transform hover:-translate-y-2">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:bg-white/20 transition-all duration-300">3</div>
              <h3 className="font-bold text-white text-xl mb-4">Learn</h3>
              <p className="text-gray-300 mb-6">Review your smart notes with summaries, key points, and study guides.</p>
              <div className="mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-30 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1">
              Create Smart Notes Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black border-t border-gray-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute right-1/4 bottom-1/3 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">Loved by <span className="relative">Students
              <span className="absolute bottom-1 left-0 w-full h-1 bg-white"></span>
            </span></h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Knowtasks is popular among students worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">MP</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Md. Shah Paran</h4>
                  <p className="text-sm text-gray-400">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"Notedly's seamless experience and intuitive design make it my top pick for creative projects. It's a game changer that continuously boosts my productivity—highly recommended!"</p>
              <div className="mt-4 border-t border-gray-800 pt-4">
                <div className="flex items-center">
                  <div className="flex text-white">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">SM</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Steve Morin</h4>
                  <p className="text-sm text-gray-400">Graduate Student</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"Love how Notedly accelerates my development and that of my teams. The AI-generated notes are comprehensive and save me hours of reading time."</p>
              <div className="mt-4 border-t border-gray-800 pt-4">
                <div className="flex items-center">
                  <div className="flex text-white">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">AK</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Aldino Kemal</h4>
                  <p className="text-sm text-gray-400">PhD Candidate</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"Notedly, the real AI partner! It's been such a huge help in getting my research tasks done—no stress reading at all. Plus, I've got to say, this is the best note-taking app I've ever used!"</p>
              <div className="mt-4 border-t border-gray-800 pt-4">
                <div className="flex items-center">
                  <div className="flex text-white">
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
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1">
              Try Notedly Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black border-t border-gray-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute left-1/4 bottom-1/3 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">What Our Users <span className="relative">Say
              <span className="absolute bottom-1 left-0 w-full h-1 bg-white"></span>
            </span></h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Join thousands of students improving their learning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">J</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Jamie L.</h4>
                  <p className="text-sm text-gray-400">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"Knowtasks has completely transformed how I study. I can upload complex CS textbook chapters and get clear, concise notes that help me understand difficult concepts."</p>
              <div className="flex text-white mt-4">
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
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Michael T.</h4>
                  <p className="text-sm text-gray-400">Medical Student</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"As a med student, I have mountains of reading. Notedly.ai's smart notes feature extracts key concepts from dense medical texts and organizes them perfectly. The AI-generated summaries save me hours of work."</p>
              <div className="flex text-white mt-4">
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
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-600 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mr-4 border border-gray-700 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Sarah K.</h4>
                  <p className="text-sm text-gray-400">History Major</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"I was skeptical about AI for humanities subjects, but Knowtasks's smart notes actually understand context and themes in historical texts. The AI-generated notes capture nuances I might miss myself."</p>
              <div className="flex text-white mt-4">
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
              Start Using Notedly Today
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
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300 font-medium">Join thousands of users who save time and improve productivity with AI-generated smart notes</p>
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
      
      {/* Features Section */}
      <section className="py-20 bg-black border-t border-gray-800 relative overflow-hidden">
        <div className="absolute right-1/4 top-1/3 w-80 h-80 bg-white/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute left-1/4 bottom-1/3 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">Smart Notes <span className="relative">Features
              <span className="absolute bottom-1 left-0 w-full h-1 bg-white"></span>
            </span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">AI-powered note generation that saves time and improves understanding</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg shadow-white/5 hover:shadow-white/10 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Smart Summaries</h3>
              <p className="text-gray-400 text-sm">AI-generated concise summaries that capture the essential points of any document.</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg shadow-white/5 hover:shadow-white/10 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Key Concept Extraction</h3>
              <p className="text-gray-400 text-sm">Automatically identifies and highlights important concepts, definitions, and terms.</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg shadow-white/5 hover:shadow-white/10 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Organized Structure</h3>
              <p className="text-gray-400 text-sm">Smart notes are automatically organized with headings, bullet points, and logical sections.</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg shadow-white/5 hover:shadow-white/10 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Study Guides</h3>
              <p className="text-gray-400 text-sm">Transform documents into comprehensive study materials with practice questions.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-black border-t border-gray-800 relative overflow-hidden">
        <div className="absolute left-1/4 top-1/2 w-72 h-72 bg-white/5 rounded-full blur-[100px] -z-10"></div>
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">How Smart Notes <span className="relative">Work
              <span className="absolute bottom-1 left-0 w-full h-1 bg-white"></span>
            </span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">Three simple steps to generate AI-powered notes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black rounded-xl shadow-lg shadow-white/5 p-8 border border-gray-800 relative hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">1</div>
              <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-white">Upload Document</h3>
              <p className="text-center text-gray-400">Upload any PDF, document, or paste text from articles, books, or research papers.</p>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-lg shadow-white/5 p-8 border border-gray-800 relative hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">2</div>
              <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-white">Smart Analysis</h3>
              <p className="text-center text-gray-400">Our AI identifies key concepts, extracts important information, and organizes content logically.</p>
            </div>
            
            <div className="bg-black rounded-xl shadow-lg shadow-white/5 p-8 border border-gray-800 relative hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">3</div>
              <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-white">Smart Notes Ready</h3>
              <p className="text-center text-gray-400">Instantly receive well-structured notes with summaries, key points, and study materials.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;