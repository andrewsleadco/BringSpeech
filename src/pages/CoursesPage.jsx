import React from 'react';
import { motion } from 'framer-motion';
import CourseList from '@/components/CourseList';

const CoursesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore All Courses</h1>
        <p className="text-lg text-gray-600">
          Discover a wide range of courses to enhance your skills and knowledge
        </p>
      </div>
      
      <CourseList />
    </motion.div>
  );
};

export default CoursesPage;