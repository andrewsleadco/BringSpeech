import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CourseContext = createContext();

export const useCourses = () => useContext(CourseContext);

// Sample course data
const sampleCourses = [
  {
    id: 'course_1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Build responsive websites from scratch.',
    category: 'Programming',
    price: 49.99,
    duration: '8 weeks',
    createdAt: '2023-01-15T10:00:00Z',
    instructor: {
      id: 'user_1',
      name: 'John Smith',
      bio: 'Senior Web Developer with 10+ years of experience'
    },
    students: ['user_2', 'user_3'],
    lessons: [
      { title: 'HTML Basics', content: 'Introduction to HTML structure and elements' },
      { title: 'CSS Styling', content: 'Learn how to style your web pages with CSS' },
      { title: 'JavaScript Fundamentals', content: 'Introduction to programming with JavaScript' }
    ]
  },
  {
    id: 'course_2',
    title: 'UI/UX Design Principles',
    description: 'Master the principles of user interface and user experience design. Create beautiful and functional designs for web and mobile applications.',
    category: 'Design',
    price: 59.99,
    duration: '6 weeks',
    createdAt: '2023-02-20T14:30:00Z',
    instructor: {
      id: 'user_4',
      name: 'Emily Chen',
      bio: 'UI/UX Designer with experience at top tech companies'
    },
    students: ['user_5', 'user_6', 'user_7'],
    lessons: [
      { title: 'Design Thinking', content: 'Understanding the design thinking process' },
      { title: 'User Research', content: 'Methods for conducting effective user research' },
      { title: 'Wireframing and Prototyping', content: 'Creating wireframes and interactive prototypes' }
    ]
  },
  {
    id: 'course_3',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data science concepts, tools, and methodologies. Learn how to analyze data and derive meaningful insights.',
    category: 'Data Science',
    price: 69.99,
    duration: '10 weeks',
    createdAt: '2023-03-10T09:15:00Z',
    instructor: {
      id: 'user_8',
      name: 'Michael Johnson',
      bio: 'Data Scientist with PhD in Computer Science'
    },
    students: ['user_9', 'user_10'],
    lessons: [
      { title: 'Introduction to Python', content: 'Getting started with Python for data analysis' },
      { title: 'Data Visualization', content: 'Creating effective visualizations with matplotlib and seaborn' },
      { title: 'Statistical Analysis', content: 'Basic statistical concepts for data science' }
    ]
  },
  {
    id: 'course_4',
    title: 'Digital Marketing Strategies',
    description: 'Learn effective digital marketing strategies to grow your business online. Cover SEO, social media, email marketing, and more.',
    category: 'Business',
    price: 39.99,
    duration: '4 weeks',
    createdAt: '2023-04-05T16:45:00Z',
    instructor: {
      id: 'user_11',
      name: 'Sarah Williams',
      bio: 'Marketing Director with 15+ years of experience'
    },
    students: ['user_12', 'user_13', 'user_14', 'user_15'],
    lessons: [
      { title: 'SEO Fundamentals', content: 'Understanding search engine optimization' },
      { title: 'Social Media Marketing', content: 'Building effective social media campaigns' },
      { title: 'Email Marketing', content: 'Creating engaging email marketing campaigns' }
    ]
  },
  {
    id: 'course_5',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Create apps that work on both iOS and Android from a single codebase.',
    category: 'Programming',
    price: 79.99,
    duration: '12 weeks',
    createdAt: '2023-05-12T11:30:00Z',
    instructor: {
      id: 'user_16',
      name: 'David Lee',
      bio: 'Mobile Developer and React Native Expert'
    },
    students: ['user_17', 'user_18'],
    lessons: [
      { title: 'React Native Basics', content: 'Introduction to React Native components and JSX' },
      { title: 'Navigation', content: 'Implementing navigation in React Native apps' },
      { title: 'State Management', content: 'Managing state with Redux and Context API' }
    ]
  },
  {
    id: 'course_6',
    title: 'Photography Masterclass',
    description: 'Learn professional photography techniques from composition to post-processing. Suitable for beginners and intermediate photographers.',
    category: 'Design',
    price: 49.99,
    duration: '6 weeks',
    createdAt: '2023-06-18T13:20:00Z',
    instructor: {
      id: 'user_19',
      name: 'Jessica Brown',
      bio: 'Professional Photographer with 20+ years of experience'
    },
    students: ['user_20', 'user_21', 'user_22'],
    lessons: [
      { title: 'Camera Basics', content: 'Understanding your camera settings and equipment' },
      { title: 'Composition Techniques', content: 'Rules and guidelines for effective composition' },
      { title: 'Lighting', content: 'Working with natural and artificial lighting' }
    ]
  }
];

export const CourseProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load courses from localStorage or use sample data
    const storedCourses = localStorage.getItem('learnhub_courses');
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch (error) {
        console.error('Failed to parse stored courses:', error);
        setCourses(sampleCourses);
        localStorage.setItem('learnhub_courses', JSON.stringify(sampleCourses));
      }
    } else {
      setCourses(sampleCourses);
      localStorage.setItem('learnhub_courses', JSON.stringify(sampleCourses));
    }
    setLoading(false);
  }, []);

  const saveCourses = (updatedCourses) => {
    setCourses(updatedCourses);
    localStorage.setItem('learnhub_courses', JSON.stringify(updatedCourses));
  };

  const getCourseById = (id) => {
    return courses.find(course => course.id === id) || null;
  };

  const createCourse = (courseData) => {
    if (!user) return null;
    
    const newCourse = {
      ...courseData,
      id: 'course_' + Math.random().toString(36).substr(2, 9),
      instructor: {
        id: user.id,
        name: user.name,
        bio: user.bio || 'Course Instructor'
      },
      students: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);
    
    // Update user's created courses
    if (user) {
      const updatedCreatedCourses = [...(user.createdCourses || []), newCourse.id];
      updateUser({ createdCourses: updatedCreatedCourses });
    }
    
    return newCourse;
  };

  const updateCourse = (id, courseData) => {
    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;
    
    const updatedCourse = { ...courses[courseIndex], ...courseData };
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = updatedCourse;
    
    saveCourses(updatedCourses);
    return updatedCourse;
  };

  const deleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    saveCourses(updatedCourses);
    
    // Update user's created courses
    if (user && user.createdCourses) {
      const updatedCreatedCourses = user.createdCourses.filter(courseId => courseId !== id);
      updateUser({ createdCourses: updatedCreatedCourses });
    }
  };

  const joinCourse = (courseId) => {
    if (!user) return false;
    
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) return false;
    
    // Check if user is already enrolled
    if (courses[courseIndex].students.includes(user.id)) return true;
    
    // Add user to course students
    const updatedCourse = { 
      ...courses[courseIndex],
      students: [...courses[courseIndex].students, user.id]
    };
    
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = updatedCourse;
    saveCourses(updatedCourses);
    
    // Update user's enrolled courses
    const updatedEnrolledCourses = [...(user.enrolledCourses || []), courseId];
    updateUser({ enrolledCourses: updatedEnrolledCourses });
    
    return true;
  };

  const leaveCourse = (courseId) => {
    if (!user) return false;
    
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) return false;
    
    // Remove user from course students
    const updatedCourse = { 
      ...courses[courseIndex],
      students: courses[courseIndex].students.filter(studentId => studentId !== user.id)
    };
    
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = updatedCourse;
    saveCourses(updatedCourses);
    
    // Update user's enrolled courses
    if (user.enrolledCourses) {
      const updatedEnrolledCourses = user.enrolledCourses.filter(id => id !== courseId);
      updateUser({ enrolledCourses: updatedEnrolledCourses });
    }
    
    return true;
  };

  const getUserCourses = (userId = null) => {
    const targetUserId = userId || (user ? user.id : null);
    if (!targetUserId) return { enrolled: [], created: [] };
    
    const enrolled = courses.filter(course => 
      course.students.includes(targetUserId)
    );
    
    const created = courses.filter(course => 
      course.instructor.id === targetUserId
    );
    
    return { enrolled, created };
  };

  const value = {
    courses,
    loading,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    joinCourse,
    leaveCourse,
    getUserCourses
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};