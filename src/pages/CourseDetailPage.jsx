import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCourseById, joinCourse, leaveCourse } = useCourses();
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const course = getCourseById(id);
  
  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
      </div>
    );
  }
  
  const isEnrolled = user && course.students.includes(user.id);
  const isInstructor = user && course.instructor.id === user.id;
  
  const handleJoinCourse = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to join this course",
        variant: "destructive",
      });
      return;
    }
    
    joinCourse(course.id);
    toast({
      title: "Success!",
      description: `You've joined "${course.title}"`,
    });
  };
  
  const handleLeaveCourse = () => {
    setShowConfirmDialog(false);
    leaveCourse(course.id);
    toast({
      title: "Course left",
      description: `You've successfully unenrolled from "${course.title}"`,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">{course.title}</h1>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary">
                  {course.category}
                </span>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <span>{course.students.length} students enrolled</span>
              </div>
              <div className="flex items-center text-gray-500">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Award className="h-5 w-5 mr-2 text-primary" />
                <span>Certificate of completion</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isInstructor ? (
                <Button variant="outline" disabled>
                  You are the instructor
                </Button>
              ) : isEnrolled ? (
                <>
                  <Button>Continue Learning</Button>
                  <Button variant="outline" onClick={() => setShowConfirmDialog(true)}>
                    Leave Course
                  </Button>
                </>
              ) : (
                <Button onClick={handleJoinCourse}>
                  {course.price > 0 ? `Enroll for $${course.price}` : 'Enroll for Free'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculum" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{lesson.title}</h3>
                      <p className="text-gray-600">{lesson.content}</p>
                    </div>
                    {isEnrolled && (
                      <Button variant="ghost" size="sm" className="ml-4">
                        <CheckCircle className="h-4 w-4 mr-1" /> Start
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="instructor" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{course.instructor.name}</h3>
                <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                <div className="flex items-center text-gray-500">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>1 course</span>
                  <span className="mx-2">•</span>
                  <Users className="h-5 w-5 mr-2" />
                  <span>{course.students.length} students</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No reviews yet for this course.</p>
              {isEnrolled && (
                <Button variant="outline">Write a Review</Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this course? You will lose access to all course materials.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeaveCourse}>
              Leave Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetailPage;