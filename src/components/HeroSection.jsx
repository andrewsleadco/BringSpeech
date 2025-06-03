import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="hero-gradient absolute inset-0 opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              <span className="block">Learn Without Limits</span>
              <span className="block text-gradient">Share Your Knowledge</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Create and join online courses on LearnHub. Expand your skills, share your expertise, 
              and connect with learners worldwide on our interactive learning platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" className="text-base">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/create-course">
                <Button size="lg" variant="outline" className="text-base">
                  Create a Course
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">100+ Courses</h3>
                <p className="text-sm text-gray-500">On various topics</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">10k+ Students</h3>
                <p className="text-sm text-gray-500">Learning together</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Expert Teachers</h3>
                <p className="text-sm text-gray-500">Industry leaders</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-auto rounded-2xl"
                alt="Students learning online"
               src="https://images.unsplash.com/photo-1694532409273-b26e2ce266ea" />
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg glass-effect"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold">Start Learning Today</p>
                    <p className="text-sm text-gray-500">Join thousands of students</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute -top-6 -left-6 bg-white p-4 rounded-lg shadow-lg glass-effect"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold">Certified Courses</p>
                  <p className="text-sm text-gray-500">Boost your career</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;