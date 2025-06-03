import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { useToast } from '@/components/ui/use-toast';

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const { joinCourse } = useCourses();
  const { toast } = useToast();

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

  const isEnrolled = user && course.students?.includes(user.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden card-hover border-2 hover:border-primary">
        <div className="relative h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            alt={`${course.title} course cover image`}
           src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2" />
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {course.category}
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold line-clamp-1">{course.title}</CardTitle>
          <CardDescription className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.students?.length || 0} students
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2 mb-2">{course.description}</p>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-1 text-primary" />
              {course.lessons?.length || 0} lessons
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <div className="font-bold text-lg">{course.price ? `${course.price}` : 'Free'}</div>
          {isEnrolled ? (
            <Link to={`/courses/${course.id}`}>
              <Button variant="outline">Continue Learning</Button>
            </Link>
          ) : (
            <Button onClick={handleJoinCourse}>Join Course</Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;