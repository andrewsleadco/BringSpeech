// pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const Dashboard = () => {
  const { session, supabase } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        setUserRole(userData?.role);
        setUser(userData);

        // Fetch enrolled courses
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', session.user.id);

        if (enrollmentError) throw enrollmentError;

        if (enrollmentData && enrollmentData.length > 0) {
          const courseIds = enrollmentData.map(enrollment => enrollment.course_id);
          
          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .in('id', courseIds);

          if (coursesError) throw coursesError;
          setEnrolledCourses(coursesData || []);
        }

        // Fetch created courses for instructors/admins
        if (userData?.role === 'instructor' || userData?.role === 'admin') {
          const { data: createdData, error: createdError } = await supabase
            .from('courses')
            .select('*')
            .eq('creator_id', session.user.id)
            .order('created_at', { ascending: false });

          if (createdError) throw createdError;
          setCreatedCourses(createdData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to BringSpeech</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to Emma Petersen's Accent Masterclass.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
            Log In
          </Link>
          <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium">
            Sign Up
          </Link>
        </div>
        <div className="mt-12">
          <Link to="/courses" className="text-blue-500 hover:underline">
            Browse all courses →
          </Link>
        </div>
      </div>
    );
  }

  // Course Card Component
  const CourseCard = ({ course, type }) => (
    <Link
      to={`/course/${course.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        {course.cover_image ? (
          <img
            src={course.cover_image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {course.description}
        </p>
        <div className="flex justify-between items-center">
          {type === 'enrolled' ? (
            <span className="text-blue-500 text-sm">Continue Learning</span>
          ) : (
            <span className="text-green-500 text-sm">Manage Course</span>
          )}
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {course.level || 'All Levels'}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.full_name || session.user.email}</h1>
        <p className="text-gray-600">
          {userRole === 'instructor' ? 'Instructor Dashboard' : 'Student Dashboard'}
        </p>
      </div>
      
      {/* Enrolled Courses Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Enrolled Courses</h2>
          <Link to="/courses" className="text-blue-500 hover:underline">
            Browse more courses
          </Link>
        </div>
        
        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} type="enrolled" />
            ))}
          </div>
        )}
      </div>
      
      {/* Instructor Created Courses Section */}
      {(userRole === 'instructor' || userRole === 'admin') && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Created Courses</h2>
            <Link to="/course/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Create New Course
            </Link>
          </div>
          
          {createdCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
              <Link to="/course/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCourses.map(course => (
                <CourseCard key={course.id} course={course} type="created" />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Quick Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-500 font-medium">Enrolled Courses</p>
            <p className="text-2xl font-bold">{enrolledCourses.length}</p>
          </div>
          
          {(userRole === 'instructor' || userRole === 'admin') && (
            <>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-500 font-medium">Created Courses</p>
                <p className="text-2xl font-bold">{createdCourses.length}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-500 font-medium">Total Students</p>
                <p className="text-2xl font-bold">
                  {createdCourses.reduce((total, course) => total + (course.student_count || 0), 0)}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-500 font-medium">Total Lessons</p>
                <p className="text-2xl font-bold">
                  {createdCourses.reduce((total, course) => total + (course.lessons_count || 0), 0)}
                </p>
              </div>
            </>
          )}

          {userRole !== 'instructor' && userRole !== 'admin' && (
            <>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-500 font-medium">Completed Lessons</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-500 font-medium">Certificates</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;