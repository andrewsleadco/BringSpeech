import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { supabase } from '@/utils/supabaseClient'; // You’ll need to create this file

const CourseContext = createContext();

export const useCourses = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('courses').select('*');
      if (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } else {
        setCourses(data);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const getCourseById = (id) => {
    return courses.find(course => course.id === id) || null;
  };

  const createCourse = async (courseData) => {
    if (!user) return null;

    const newCourse = {
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      price: courseData.price,
      duration: courseData.duration,
      instructor_id: user.id,
      image_url: courseData.image_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    };

    const { data, error } = await supabase.from('courses').insert([newCourse]).select();
    if (error) {
      console.error('Error creating course:', error);
      return null;
    }

    setCourses(prev => [...prev, ...data]);
    return data[0];
  };

  const updateCourse = async (id, courseData) => {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating course:', error);
      return null;
    }

    setCourses(prev =>
      prev.map(course => (course.id === id ? data[0] : course))
    );

    return data[0];
  };

  const deleteCourse = async (id) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      return;
    }

    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const getUserCourses = (userId = null) => {
    const targetUserId = userId || (user ? user.id : null);
    if (!targetUserId) return { enrolled: [], created: [] };

    const created = courses.filter(course => course.instructor_id === targetUserId);
    // Enrollment will later come from the `enrollments` table

    return { enrolled: [], created };
  };

  const value = {
    courses,
    loading,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getUserCourses
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};
