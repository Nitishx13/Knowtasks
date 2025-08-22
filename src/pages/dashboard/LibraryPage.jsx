import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const LibraryPage = () => {
  // Sample data for subjects
  const subjects = [
    { 
      id: 1, 
      title: 'Psychology', 
      chapters: 8, 
      progress: 60, 
      lastUpdated: '2 days ago',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      id: 2, 
      title: 'Economics', 
      chapters: 5, 
      progress: 25, 
      lastUpdated: '1 week ago',
      badge: 'New',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 3, 
      title: 'Computer Science', 
      chapters: 10, 
      progress: 80, 
      lastUpdated: '3 days ago',
      badge: 'Popular',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Your Library</h1>
        <p className="text-gray-400 text-lg">Manage your study materials and notes</p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subjects.map((subject) => (
          <div key={subject.id} className="group relative bg-black backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 shadow-lg">
                    {subject.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl">{subject.title}</h3>
                    <p className="text-sm text-gray-300">{subject.chapters} chapters</p>
                  </div>
                </div>
                {subject.badge && (
                  <span className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">{subject.badge}</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full mb-5">
                <div className="h-1.5 bg-white rounded-full" style={{width: `${subject.progress}%`}}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Last updated: {subject.lastUpdated}</span>
                <button className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 group-hover:bg-white/20">View Notes</button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Subject Card */}
        <div className="group relative bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-dashed border-gray-700 shadow-lg hover:shadow-xl hover:shadow-white/5 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-bold text-white text-xl mb-2">Add New Subject</h3>
          <p className="text-gray-300 text-sm mb-4">Create a new collection for your study materials</p>
          <button className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white border border-white/30 hover:border-white hover:bg-gray-800 transition-all duration-300">Create New</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <button className="text-white hover:text-gray-300 text-sm font-medium">View All →</button>
        </div>
        
        <div className="bg-black rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Updated notes in <span className="font-semibold">Psychology</span></p>
                    <p className="text-xs text-gray-400">{item === 1 ? 'Today' : item === 2 ? 'Yesterday' : '3 days ago'}</p>
                  </div>
                </div>
                <button className="text-white hover:text-gray-300 text-sm">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with AI message */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-800 mt-8">
        <p>🤖 Powered by Knowtasks</p>
      </div>
    </>
  );
};

export default LibraryPage;