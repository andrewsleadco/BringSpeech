// pages/CourseDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, supabase } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', id)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);

        // Check enrollment if user is logged in
        if (session?.user) {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('*')
            .eq('course_id', id)
            .eq('user_id', session.user.id)
            .single();

          if (enrollmentError && enrollmentError.code !== 'PGRST116') {
            throw enrollmentError;
          }

          setEnrolled(!!enrollmentData);

          // Get user role
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;
          setUserRole(userData?.role);
        }
      } catch (error) {
        console.error(error);
        setError('Error loading course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, supabase, session]);

  const handleEnroll = async () => {
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase.from('enrollments').insert([
        {
          user_id: session.user.id,
          course_id: id,
        },
      ]);

      if (error) throw error;
      setEnrolled(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const openLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Course not found'}
      </div>
    );
  }

  const isCreator = userRole === 'admin' || userRole === 'instructor';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {course.cover_image ? (
            <img
              src={course.cover_image}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              {isCreator && (
                <Link
                  to={`/course/edit/${course.id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Edit Course
                </Link>
              )}
            </div>
            <div className="flex items-center mb-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-3">
                {course.level || 'All Levels'}
              </span>
              <span className="text-gray-600 mr-3">{lessons.length} lessons</span>
              <span className="text-gray-600">{course.duration || 'Self-paced'}</span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
            </div>
            {currentLesson && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{currentLesson.title}</h2>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>
                {currentLesson.video_url && (
                  <div className="mt-4">
                    <video
                      controls
                      className="w-full rounded-lg"
                      src={currentLesson.video_url}
                    ></video>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
          {!enrolled && !isCreator ? (
            <div className="mb-6">
              <button
                onClick={handleEnroll}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4"
              >
                Enroll in Course
              </button>
              <p className="text-gray-600 text-sm text-center">
                Enroll to access all course materials
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Course Content</h3>
              <p className="text-gray-600 text-sm mb-4">
                {lessons.length} lessons • {course.duration || 'Self-paced'}
              </p>
              <ul className="divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="py-3">
                    <button
                      onClick={() => openLesson(lesson)}
                      className="flex items-start w-full text-left hover:bg-gray-50 p-2 rounded"
                    >
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-3 mt-0.5">
                        {lesson.order_index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-gray-500 text-sm">{lesson.duration || 'Video'}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;