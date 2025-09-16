import React, { useState } from 'react';
import { Button } from '../ui/button';

const DigitalSkillsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const skillsData = [
    {
      id: 1,
      title: 'Introduction to Digital Marketing',
      category: 'marketing',
      level: 'Beginner',
      duration: '4 weeks',
      description: 'Learn the fundamentals of digital marketing including SEO, social media, and content marketing.',
      image: '/images/digital-marketing.svg' // This is a placeholder, you'll need to add actual images
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      category: 'design',
      level: 'Intermediate',
      duration: '6 weeks',
      description: 'Master the principles of user interface and user experience design for digital products.',
      image: '/images/ui-ux-design.svg'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      category: 'programming',
      level: 'Beginner',
      duration: '8 weeks',
      description: 'Learn Python programming with a focus on data analysis and visualization.',
      image: '/images/python-programming.svg'
    },
    {
      id: 4,
      title: 'AI Fundamentals',
      category: 'ai',
      level: 'Intermediate',
      duration: '10 weeks',
      description: 'Understand the core concepts of artificial intelligence and machine learning.',
      image: '/images/ai-fundamentals.svg'
    },
    {
      id: 5,
      title: 'Advanced Social Media Marketing',
      category: 'marketing',
      level: 'Advanced',
      duration: '5 weeks',
      description: 'Develop advanced strategies for marketing on social media platforms.',
      image: '/images/social-media.svg'
    },
    {
      id: 6,
      title: 'JavaScript Fundamentals',
      category: 'programming',
      level: 'Beginner',
      duration: '6 weeks',
      description: 'Learn the basics of JavaScript programming for web development.',
      image: '/images/javascript.svg'
    },
    {
      id: 7,
      title: 'Responsive Web Design',
      category: 'design',
      level: 'Beginner',
      duration: '4 weeks',
      description: 'Learn how to create websites that work on any device and screen size.',
      image: '/images/responsive-design.svg'
    },
    {
      id: 8,
      title: 'Natural Language Processing',
      category: 'ai',
      level: 'Advanced',
      duration: '12 weeks',
      description: 'Explore how AI can understand and generate human language.',
      image: '/images/nlp.svg'
    }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeCategory);

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Digital Skills</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setActiveCategory('all')} 
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
          >
            All
          </Button>
          <Button 
            onClick={() => setActiveCategory('marketing')} 
            variant={activeCategory === 'marketing' ? 'default' : 'outline'}
            size="sm"
          >
            Digital Marketing
          </Button>
          <Button 
            onClick={() => setActiveCategory('design')} 
            variant={activeCategory === 'design' ? 'default' : 'outline'}
            size="sm"
          >
            UI/UX Design
          </Button>
          <Button 
            onClick={() => setActiveCategory('programming')} 
            variant={activeCategory === 'programming' ? 'default' : 'outline'}
            size="sm"
          >
            Programming
          </Button>
          <Button 
            onClick={() => setActiveCategory('ai')} 
            variant={activeCategory === 'ai' ? 'default' : 'outline'}
            size="sm"
          >
            AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {/* Placeholder for image */}
              <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{skill.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{skill.duration}</span>
                <Button size="sm">Learn More</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalSkillsPage;