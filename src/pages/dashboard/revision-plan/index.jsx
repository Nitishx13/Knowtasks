import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const RevisionPlanPage = () => {
  const router = useRouter();
  const { type } = router.query;
  
  const [activeTab, setActiveTab] = useState('daily');
  const [educationalContext, setEducationalContext] = useState('general');
  
  // Set educational context based on URL query parameter
  useEffect(() => {
    if (type === 'iit') {
      setEducationalContext('iit');
    } else if (type === 'neet') {
      setEducationalContext('neet');
    } else if (type === 'digital') {
      setEducationalContext('digital');
    }
  }, [type]);
  
  // Sample revision plan data
  const revisionData = {
    iit: [
      { id: 1, title: 'Physics: Mechanics', subject: 'physics', time: '09:00 AM', duration: '2 hours', description: 'Review Newton\'s laws and solve practice problems' },
      { id: 2, title: 'Mathematics: Calculus', subject: 'mathematics', time: '11:30 AM', duration: '2 hours', description: 'Practice integration techniques and applications' },
      { id: 3, title: 'Chemistry: Organic Chemistry', subject: 'chemistry', time: '02:30 PM', duration: '1.5 hours', description: 'Study reaction mechanisms and solve problems' }
    ],
    neet: [
      { id: 1, title: 'Biology: Human Physiology', subject: 'biology', time: '09:00 AM', duration: '2 hours', description: 'Review circulatory and respiratory systems' },
      { id: 2, title: 'Physics: Optics', subject: 'physics', time: '11:30 AM', duration: '1.5 hours', description: 'Practice problems on lenses and optical instruments' },
      { id: 3, title: 'Chemistry: Periodic Table', subject: 'chemistry', time: '02:00 PM', duration: '1.5 hours', description: 'Study periodic trends and properties' }
    ],
    digital: [
      { id: 1, title: 'Programming Fundamentals', subject: 'programming', time: '10:00 AM', duration: '1.5 hours', description: 'Practice basic programming concepts and algorithms' },
      { id: 2, title: 'Web Development', subject: 'programming', time: '01:00 PM', duration: '2 hours', description: 'Build a responsive webpage using HTML, CSS, and JavaScript' },
      { id: 3, title: 'Data Analysis', subject: 'programming', time: '03:30 PM', duration: '1.5 hours', description: 'Practice data visualization and analysis techniques' }
    ],
    general: [
      { id: 1, title: 'Study Session 1', subject: 'general', time: '09:00 AM', duration: '1.5 hours', description: 'Review notes and practice problems' },
      { id: 2, title: 'Study Session 2', subject: 'general', time: '11:00 AM', duration: '1.5 hours', description: 'Continue with practice problems and exercises' },
      { id: 3, title: 'Study Session 3', subject: 'general', time: '02:00 PM', duration: '1.5 hours', description: 'Review difficult concepts and solve problems' }
    ]
  };
  
  // Sample study plans data
  const studyPlansData = {
    iit: [
      { id: 1, title: 'Physics Weekly Plan', badge: 'iit', progress: 65, tasks: [
        { id: 1, title: 'Complete mechanics problems', completed: true },
        { id: 2, title: 'Review electromagnetism concepts', completed: true },
        { id: 3, title: 'Practice thermodynamics problems', completed: false },
        { id: 4, title: 'Take mock test on optics', completed: false }
      ]},
      { id: 2, title: 'Mathematics Weekly Plan', badge: 'iit', progress: 40, tasks: [
        { id: 1, title: 'Practice calculus problems', completed: true },
        { id: 2, title: 'Review coordinate geometry', completed: false },
        { id: 3, title: 'Solve algebra exercises', completed: false },
        { id: 4, title: 'Take mock test on trigonometry', completed: false }
      ]},
      { id: 3, title: 'Chemistry Weekly Plan', badge: 'iit', progress: 25, tasks: [
        { id: 1, title: 'Study organic chemistry reactions', completed: true },
        { id: 2, title: 'Practice inorganic chemistry problems', completed: false },
        { id: 3, title: 'Review physical chemistry concepts', completed: false },
        { id: 4, title: 'Take mock test on chemical bonding', completed: false }
      ]}
    ],
    neet: [
      { id: 1, title: 'Biology Weekly Plan', badge: 'neet', progress: 75, tasks: [
        { id: 1, title: 'Review human physiology', completed: true },
        { id: 2, title: 'Study plant physiology', completed: true },
        { id: 3, title: 'Practice genetics problems', completed: true },
        { id: 4, title: 'Take mock test on ecology', completed: false }
      ]},
      { id: 2, title: 'Physics Weekly Plan', badge: 'neet', progress: 50, tasks: [
        { id: 1, title: 'Practice mechanics problems', completed: true },
        { id: 2, title: 'Review optics concepts', completed: true },
        { id: 3, title: 'Study thermodynamics', completed: false },
        { id: 4, title: 'Take mock test on electromagnetism', completed: false }
      ]},
      { id: 3, title: 'Chemistry Weekly Plan', badge: 'neet', progress: 35, tasks: [
        { id: 1, title: 'Study organic chemistry', completed: true },
        { id: 2, title: 'Practice inorganic chemistry', completed: false },
        { id: 3, title: 'Review physical chemistry', completed: false },
        { id: 4, title: 'Take mock test on chemical equilibrium', completed: false }
      ]}
    ],
    digital: [
      { id: 1, title: 'Programming Weekly Plan', badge: 'digital', progress: 60, tasks: [
        { id: 1, title: 'Practice basic algorithms', completed: true },
        { id: 2, title: 'Build a simple web application', completed: true },
        { id: 3, title: 'Study data structures', completed: false },
        { id: 4, title: 'Complete coding challenge', completed: false }
      ]},
      { id: 2, title: 'Web Development Plan', badge: 'digital', progress: 45, tasks: [
        { id: 1, title: 'Practice HTML and CSS', completed: true },
        { id: 2, title: 'Build responsive layouts', completed: true },
        { id: 3, title: 'Learn JavaScript fundamentals', completed: false },
        { id: 4, title: 'Create a portfolio website', completed: false }
      ]},
      { id: 3, title: 'Data Analysis Plan', badge: 'digital', progress: 30, tasks: [
        { id: 1, title: 'Learn basic statistics', completed: true },
        { id: 2, title: 'Practice data visualization', completed: false },
        { id: 3, title: 'Study data cleaning techniques', completed: false },
        { id: 4, title: 'Complete data analysis project', completed: false }
      ]}
    ],
    general: [
      { id: 1, title: 'Weekly Study Plan 1', badge: 'general', progress: 50, tasks: [
        { id: 1, title: 'Review notes from lectures', completed: true },
        { id: 2, title: 'Complete practice problems', completed: true },
        { id: 3, title: 'Study difficult concepts', completed: false },
        { id: 4, title: 'Take practice test', completed: false }
      ]},
      { id: 2, title: 'Weekly Study Plan 2', badge: 'general', progress: 25, tasks: [
        { id: 1, title: 'Review previous material', completed: true },
        { id: 2, title: 'Practice new problems', completed: false },
        { id: 3, title: 'Study advanced concepts', completed: false },
        { id: 4, title: 'Take comprehensive test', completed: false }
      ]},
      { id: 3, title: 'Weekly Study Plan 3', badge: 'general', progress: 0, tasks: [
        { id: 1, title: 'Start new topic review', completed: false },
        { id: 2, title: 'Practice basic problems', completed: false },
        { id: 3, title: 'Study core concepts', completed: false },
        { id: 4, title: 'Take initial assessment', completed: false }
      ]}
    ]
  };
  
  // Get current data based on educational context
  const currentRevisionData = revisionData[educationalContext] || revisionData.general;
  const currentStudyPlans = studyPlansData[educationalContext] || studyPlansData.general;
  
  // Banner title and description based on educational context
  const getBannerContent = () => {
    switch(educationalContext) {
      case 'iit':
        return {
          title: 'IIT-JEE Preparation',
          description: 'Structured revision plans for Physics, Chemistry, and Mathematics to help you ace the JEE exams.'
        };
      case 'neet':
        return {
          title: 'NEET Preparation',
          description: 'Comprehensive revision plans for Biology, Physics, and Chemistry to help you succeed in NEET.'
        };
      case 'digital':
        return {
          title: 'Digital Skills Learning',
          description: 'Structured learning paths for programming, web development, and data analysis skills.'
        };
      default:
        return {
          title: 'Study Plan & Revision',
          description: 'Organize your study schedule and track your progress with our revision planning tools.'
        };
    }
  };
  
  const bannerContent = getBannerContent();
  
  // Toggle task completion
  const toggleTaskCompletion = (planId, taskId) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggled task ${taskId} in plan ${planId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="revision-plan-page">
        <div className="page-header">
          <h1>Revision Plan</h1>
          <p>Organize your study schedule and track your progress</p>
        </div>
        
        {/* Educational Context Banner */}
        <div className={`educational-context-banner ${educationalContext}-banner`}>
          <div className="banner-content">
            <h2>{bannerContent.title}</h2>
            <p>{bannerContent.description}</p>
            <div className="flex space-x-4">
              <Link href="#schedule" className={`banner-cta ${educationalContext}-cta`}>
                View Schedule
              </Link>
              {educationalContext !== 'general' && (
                <Link href="/dashboard/revision-plan" className="banner-cta bg-white/20 border border-white text-white font-bold hover:bg-white/30">
                  View All Plans
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Revision Tabs */}
        <div className="revision-tabs">
          <button 
            className={`revision-tab ${activeTab === 'daily' ? 'active' : ''} ${educationalContext !== 'general' ? `${educationalContext}-tab` : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Schedule
          </button>
          <button 
            className={`revision-tab ${activeTab === 'weekly' ? 'active' : ''} ${educationalContext !== 'general' ? `${educationalContext}-tab` : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Plan
          </button>
          <button 
            className={`revision-tab ${activeTab === 'monthly' ? 'active' : ''} ${educationalContext !== 'general' ? `${educationalContext}-tab` : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Overview
          </button>
          <button 
            className={`revision-tab ${activeTab === 'resources' ? 'active' : ''} ${educationalContext !== 'general' ? `${educationalContext}-tab` : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Study Resources
          </button>
        </div>
        
        {/* Educational Context Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link 
            href="/dashboard/revision-plan"
            className={`px-3 py-1 rounded-full text-sm font-medium ${educationalContext === 'general' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            General
          </Link>
          <Link 
            href="/dashboard/revision-plan?type=iit"
            className={`px-3 py-1 rounded-full text-sm font-medium ${educationalContext === 'iit' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          >
            IIT-JEE
          </Link>
          <Link 
            href="/dashboard/revision-plan?type=neet"
            className={`px-3 py-1 rounded-full text-sm font-medium ${educationalContext === 'neet' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
          >
            NEET
          </Link>
          <Link 
            href="/dashboard/revision-plan?type=digital"
            className={`px-3 py-1 rounded-full text-sm font-medium ${educationalContext === 'digital' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
          >
            Digital Skills
          </Link>
        </div>
        
        {activeTab === 'daily' && (
          <div id="schedule" className="revision-schedule">
            <div className="schedule-header">
              <h3>Today's Schedule</h3>
              <div className="schedule-actions">
                <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>
            <div className="schedule-list">
              {currentRevisionData.map(item => (
                <div key={item.id} className={`schedule-item ${educationalContext}-schedule`}>
                  <div className="schedule-time">
                    <div className="time">{item.time}</div>
                    <div className="duration">{item.duration}</div>
                  </div>
                  <div className="schedule-content">
                    <div className="schedule-title">
                      {item.title}
                      <span className={`subject-tag ${item.subject}`}>{item.subject}</span>
                    </div>
                    <div className="schedule-description">{item.description}</div>
                    <div className="schedule-meta">
                      <div className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Not started
                      </div>
                      <div className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Resources available
                      </div>
                    </div>
                  </div>
                  <div className="schedule-actions">
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'weekly' && (
          <div className="study-plan">
            <div className="plan-header">
              <h3>Weekly Study Plans</h3>
            </div>
            <div className="plan-cards">
              {currentStudyPlans.map(plan => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-title">
                    {plan.title}
                    <span className={`plan-badge ${plan.badge}`}>{plan.badge === 'iit' ? 'IIT-JEE' : plan.badge === 'neet' ? 'NEET' : plan.badge === 'digital' ? 'Digital' : 'General'}</span>
                  </div>
                  <div className="plan-progress">
                    <div className="progress-header">
                      <div className="progress-label">Progress</div>
                      <div className="progress-value">{plan.progress}%</div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${plan.badge}-progress`} 
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="plan-tasks">
                    {plan.tasks.map(task => (
                      <div key={task.id} className="task-item">
                        <div className="task-checkbox">
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleTaskCompletion(plan.id, task.id)} 
                            className={`${plan.badge}-checkbox`}
                          />
                        </div>
                        <div className="task-content">
                          <div className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="plan-footer">
                    <button className="add-task-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'monthly' && (
          <div className="revision-calendar">
            <div className="calendar-header">
              <div className="month-selector">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3>June 2023</h3>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="view-selector">
                <button className="active">Month</button>
                <button>Week</button>
                <button>Day</button>
              </div>
            </div>
            <div className="calendar-grid">
              {/* Weekday headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday-header">{day}</div>
              ))}
              
              {/* Calendar days - this would be generated dynamically in a real app */}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3; // Offset to start month on a Thursday
                return (
                  <div 
                    key={i} 
                    className={`calendar-day ${day === 15 ? 'today' : ''} ${[5, 12, 19, 26].includes(day) ? 'has-events' : ''}`}
                  >
                    {day > 0 && day <= 30 && (
                      <>
                        <div className="day-number">{day}</div>
                        {[5, 12, 19, 26].includes(day) && (
                          <div className="event-indicator">
                            {educationalContext === 'iit' && <div className="indicator iit-event"></div>}
                            {educationalContext === 'neet' && <div className="indicator neet-event"></div>}
                            {educationalContext === 'digital' && <div className="indicator digital-event"></div>}
                            {educationalContext === 'general' && <div className="indicator"></div>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource cards would be dynamically generated based on educational context */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  {educationalContext === 'iit' ? 'Physics Study Material' : 
                   educationalContext === 'neet' ? 'Biology Study Material' : 
                   educationalContext === 'digital' ? 'Programming Tutorials' : 
                   'General Study Material'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {educationalContext === 'iit' ? 'Comprehensive notes and practice problems for JEE Physics.' : 
                   educationalContext === 'neet' ? 'Detailed notes on human physiology and other biology topics.' : 
                   educationalContext === 'digital' ? 'Step-by-step tutorials for learning programming fundamentals.' : 
                   'General study materials and notes for various subjects.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Updated 2 days ago</span>
                  <button className={`px-3 py-1 rounded-md text-white text-sm ${educationalContext === 'iit' ? 'bg-blue-600' : educationalContext === 'neet' ? 'bg-green-600' : educationalContext === 'digital' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    View Resource
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  {educationalContext === 'iit' ? 'Mathematics Video Lectures' : 
                   educationalContext === 'neet' ? 'Chemistry Video Lectures' : 
                   educationalContext === 'digital' ? 'Web Development Tutorials' : 
                   'Video Tutorials'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {educationalContext === 'iit' ? 'Video lectures covering advanced mathematics topics for JEE.' : 
                   educationalContext === 'neet' ? 'Detailed video explanations of chemistry concepts for NEET.' : 
                   educationalContext === 'digital' ? 'Video tutorials on building responsive websites with modern tools.' : 
                   'Video tutorials covering various academic subjects.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">20 videos</span>
                  <button className={`px-3 py-1 rounded-md text-white text-sm ${educationalContext === 'iit' ? 'bg-blue-600' : educationalContext === 'neet' ? 'bg-green-600' : educationalContext === 'digital' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  {educationalContext === 'iit' ? 'Practice Tests' : 
                   educationalContext === 'neet' ? 'Mock Exams' : 
                   educationalContext === 'digital' ? 'Coding Challenges' : 
                   'Practice Assessments'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {educationalContext === 'iit' ? 'Full-length practice tests for JEE Main and Advanced.' : 
                   educationalContext === 'neet' ? 'Comprehensive mock exams to prepare for NEET.' : 
                   educationalContext === 'digital' ? 'Hands-on coding challenges to test your programming skills.' : 
                   'Practice assessments to test your knowledge and understanding.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">15 tests available</span>
                  <button className={`px-3 py-1 rounded-md text-white text-sm ${educationalContext === 'iit' ? 'bg-blue-600' : educationalContext === 'neet' ? 'bg-green-600' : educationalContext === 'digital' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RevisionPlanPage;