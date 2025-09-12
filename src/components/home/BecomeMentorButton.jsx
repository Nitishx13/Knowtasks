import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BecomeMentorForm from './BecomeMentorForm';
import { Button } from '../ui/Button';

const BecomeMentorButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => setShowModal(true)}
          variant="outline" 
          size="lg" 
          className="px-8 py-6 text-base md:text-lg font-bold rounded-xl border-2 border-purple-500/30 text-white bg-purple-500/10 backdrop-blur-sm hover:bg-purple-500/20 transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-3">
            👨‍🏫 BECOME A MENTOR
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Button>
      </motion.div>

      {showModal && <BecomeMentorForm onClose={() => setShowModal(false)} />}
    </>
  );
};

export default BecomeMentorButton;