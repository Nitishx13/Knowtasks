import { motion } from 'framer-motion';
import QuizMakerComponent from '@/components/dashboard/QuizMakerComponent';

export default function QZMakerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Maker</h1>
              <p className="text-gray-600">Create custom quizzes for your students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QuizMakerComponent />
        </motion.div>
      </div>
    </div>
  );
}