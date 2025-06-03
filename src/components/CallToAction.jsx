import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of students and instructors on LearnHub. Create your own course or find the perfect one to enhance your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/create-course">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Become an Instructor
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-auto">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Student learning online"
               src="https://images.unsplash.com/photo-1694532409273-b26e2ce266ea" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;