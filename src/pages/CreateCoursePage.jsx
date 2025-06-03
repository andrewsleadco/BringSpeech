import React from 'react';
import { motion } from 'framer-motion';
import CourseForm from '@/components/CourseForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CreateCoursePage = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const handleLoginPrompt = () => {
    login();
    toast({
      title: "Welcome!",
      description: "You can now create your course",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {user ? (
        <CourseForm />
      ) : (
        <div className="text-center py-16 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Your Own Course</h1>
          <p className="text-lg text-gray-600 mb-8">
            Share your knowledge with the world by creating your own course on LearnHub.
            Please log in to get started.
          </p>
          <Button size="lg" onClick={handleLoginPrompt}>
            Log in to Create a Course
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default CreateCoursePage;