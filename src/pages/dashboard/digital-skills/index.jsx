import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const DigitalSkillsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample digital skills data
  const skillsData = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript to build responsive websites',
      category: 'programming',
      level: 'beginner',
      duration: '8 weeks',
      image: '/images/skills/web-dev.jpg'
    },
    {
      id: 2,
      title: 'Digital Marketing Essentials',
      description: 'Master social media, SEO, and content marketing strategies',
      category: 'marketing',
      level: 'beginner',
      duration: '6 weeks',
      image: '/images/skills/digital-marketing.jpg'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      description: 'Create user-friendly interfaces and engaging user experiences',
      category: 'design',
      level: 'intermediate',
      duration: '10 weeks',
      image: '/images/skills/ui-ux.jpg'
    },
    {
      id: 4,
      title: 'AI and Machine Learning Basics',
      description: 'Understand the fundamentals of artificial intelligence and ML algorithms',
      category: 'ai',
      level: 'advanced',
      duration: '12 weeks',
      image: '/images/skills/ai-ml.jpg'
    }
  ];
  
  // Filter skills based on active filter
  const filteredSkills = activeFilter === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeFilter);
  
  return (
    <DashboardLayout>
      <div className="digital-skills-page">
        <div className="page-header">
          <h1>Digital Skills</h1>
          <p>Explore and learn essential digital skills for your future career</p>
        </div>
        
        {/* Digital Skills Banner */}
        <div className="skills-banner">
          <div className="banner-content">
            <h2>Boost Your Digital Literacy</h2>
            <p>
              Whether you&rsquo;re in high school, college, or preparing for competitive exams like IIT-JEE or NEET,
              digital skills will give you a competitive edge in today&rsquo;s technology-driven world.
            </p>
            <Link href="#skills-grid" className="banner-cta">Explore Skills</Link>
          </div>
        </div>
        
        {/* Target Audience Section */}
        <div className="target-audience">
          <h2 className="text-xl font-bold mb-4">Who Can Benefit</h2>
          <div className="audience-cards">
            <div className="audience-card high-school">
              <div className="audience-header">
                <div className="audience-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h3 className="audience-title">High School Students</h3>
              </div>
              <div className="audience-content">
                <ul>
                  <li>Build a foundation in digital literacy</li>
                  <li>Enhance school projects with digital tools</li>
                  <li>Prepare for future academic requirements</li>
                </ul>
              </div>
            </div>
            
            <div className="audience-card college">
              <div className="audience-header">
                <div className="audience-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <h3 className="audience-title">College Students</h3>
              </div>
              <div className="audience-content">
                <ul>
                  <li>Complement your degree with practical skills</li>
                  <li>Stand out in internship and job applications</li>
                  <li>Collaborate effectively on group projects</li>
                </ul>
              </div>
            </div>
            
            <div className="audience-card iit-jee">
              <div className="audience-header">
                <div className="audience-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
                <h3 className="audience-title">IIT-JEE Aspirants</h3>
              </div>
              <div className="audience-content">
                <ul>
                  <li>Use digital tools to enhance problem-solving</li>
                  <li>Visualize complex mathematical concepts</li>
                  <li>Prepare for tech-focused engineering education</li>
                </ul>
              </div>
            </div>
            
            <div className="audience-card neet">
              <div className="audience-header">
                <div className="audience-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                  </svg>
                </div>
                <h3 className="audience-title">NEET Aspirants</h3>
              </div>
              <div className="audience-content">
                <ul>
                  <li>Access digital resources for biology and chemistry</li>
                  <li>Organize study materials efficiently</li>
                  <li>Prepare for technology use in medical education</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="filter-section">
          <h2 className="text-xl font-bold mb-4">Explore Skills</h2>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Skills
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'programming' ? 'active' : ''}`}
              onClick={() => setActiveFilter('programming')}
            >
              Programming
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'design' ? 'active' : ''}`}
              onClick={() => setActiveFilter('design')}
            >
              Design
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'marketing' ? 'active' : ''}`}
              onClick={() => setActiveFilter('marketing')}
            >
              Digital Marketing
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ai')}
            >
              AI & Machine Learning
            </button>
          </div>
        </div>
        
        {/* Skills Grid */}
        <div id="skills-grid" className="skills-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div key={skill.id} className={`skill-card ${skill.category}`}>
                <div className="skill-image">
                  {/* Placeholder for image */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="skill-content">
                  <div className="skill-header">
                    <h3 className="skill-title">{skill.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${skill.level === 'beginner' ? 'bg-green-100 text-green-800' : skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                    </span>
                  </div>
                  <p className="skill-description">{skill.description}</p>
                  <div className="skill-meta">
                    <div className="skill-duration">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {skill.duration}
                    </div>
                  </div>
                </div>
                <div className="skill-footer">
                  <Link href={`/dashboard/digital-skills/${skill.id}`} className="skill-cta">
                    Learn More
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No skills found</h3>
              <p>We couldn&rsquo;t find any skills matching your filter criteria.</p>
              <button 
                onClick={() => setActiveFilter('all')} 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View All Skills
              </button>
            </div>
          )}
        </div>
        
        {/* Career Paths Section */}
        <div className="career-paths">
          <div className="section-header">
            <h2>Career Paths</h2>
            <p>Discover how digital skills can enhance your career opportunities</p>
          </div>
          <div className="paths-grid">
            <div className="path-card">
              <div className="path-image">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="path-content">
                <h3 className="path-title">Software Development</h3>
                <p className="path-description">Build applications, websites, and software solutions</p>
                <div className="path-stats">
                  <div className="stat-item">
                    <p className="stat-value">₹8L+</p>
                    <p className="stat-label">Avg. Salary</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-value">35%</p>
                    <p className="stat-label">Growth Rate</p>
                  </div>
                </div>
              </div>
              <div className="path-footer">
                <Link href="/dashboard/digital-skills/paths/software-development" className="path-cta">
                  Explore Path
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="path-card">
              <div className="path-image">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </div>
              <div className="path-content">
                <h3 className="path-title">UX/UI Design</h3>
                <p className="path-description">Create user-friendly interfaces and engaging experiences</p>
                <div className="path-stats">
                  <div className="stat-item">
                    <p className="stat-value">₹7L+</p>
                    <p className="stat-label">Avg. Salary</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-value">28%</p>
                    <p className="stat-label">Growth Rate</p>
                  </div>
                </div>
              </div>
              <div className="path-footer">
                <Link href="/dashboard/digital-skills/paths/ux-ui-design" className="path-cta">
                  Explore Path
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="path-card">
              <div className="path-image">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="path-content">
                <h3 className="path-title">Data Science</h3>
                <p className="path-description">Analyze data and extract valuable insights for decision-making</p>
                <div className="path-stats">
                  <div className="stat-item">
                    <p className="stat-value">₹10L+</p>
                    <p className="stat-label">Avg. Salary</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-value">40%</p>
                    <p className="stat-label">Growth Rate</p>
                  </div>
                </div>
              </div>
              <div className="path-footer">
                <Link href="/dashboard/digital-skills/paths/data-science" className="path-cta">
                  Explore Path
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DigitalSkillsPage;