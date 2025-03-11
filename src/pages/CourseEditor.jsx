// pages/CourseEditor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { supabase, session } = useContext(AuthContext);
  const isNewCourse = id === undefined;

  const [course, setCourse] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    cover_image: null,
    duration: 'Self-paced',
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(!isNewCourse);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  const emptyLesson = {
    title: '',
    content: '',
    video_url: '',
    duration: '',
    order_index: 0,
    isNew: true,
  };

  const [currentLesson, setCurrentLesson] = useState(emptyLesson);

  useEffect(() => {
    if (!isNewCourse) {
      fetchCourseData();
    } else {
      setLoading(false);
    }
  }, [id, supabase]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);
      
      if (courseData.cover_image) {
        setCoverImagePreview(courseData.cover_image);
      }

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Error loading course data');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({
      ...currentLesson,
      [name]: value,
    });
  };

  const addNewLesson = () => {
    setCurrentLessonId(null);
    setCurrentLesson({
      ...emptyLesson,
      order_index: lessons.length,
    });
  };

  const editLesson = (lesson) => {
    setCurrentLessonId(lesson.id);
    setCurrentLesson(lesson);
  };

  const saveLesson = async () => {
    if (!currentLesson.title) {
      alert('Lesson title is required');
      return;
    }

    try {
      const lessonToSave = { ...currentLesson };
      delete lessonToSave.isNew;

      if (currentLessonId) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update(lessonToSave)
          .eq('id', currentLessonId);

        if (error) throw error;

        setLessons(lessons.map(l => l.id === currentLessonId ? { ...lessonToSave, id: currentLessonId } : l));
      } else {
        // Create new lesson
        lessonToSave.course_id = id || course.id;
        
        const { data, error } = await supabase
          .from('lessons')
          .insert([lessonToSave])
          .select();

        if (error) throw error;

        setLessons([...lessons, data[0]]);
      }

      // Reset form
      setCurrentLessonId(null);
      setCurrentLesson(emptyLesson);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson');
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      setLessons(lessons.filter(l => l.id !== lessonId));

      if (currentLessonId === lessonId) {
        setCurrentLessonId(null);
        setCurrentLesson(emptyLesson);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for each lesson
    const updatedLessons = items.map((item, index) => ({
      ...item,
      order_index: index,
    }));

    setLessons(updatedLessons);

    // Update the order in the database
    try {
      const updates = updatedLessons.map(lesson => ({
        id: lesson.id,
        order_index: lesson.order_index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('lessons')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating lesson order:', error);
    }
  };

  const saveCourse = async () => {
    if (!course.title) {
      alert('Course title is required');
      return;
    }

    setSaving(true);
    try {
      let coverImageUrl = course.cover_image;

      // Upload cover image if there's a new one
      if (coverImageFile) {
        const fileExt = coverImageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `course-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-media')
          .upload(filePath, coverImageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('course-media')
          .getPublicUrl(filePath);

        coverImageUrl = data.publicUrl;
      }

      const courseData = {
        ...course,
        cover_image: coverImageUrl,
        updated_at: new Date(),
      };

      if (isNewCourse) {
        // Create new course
        courseData.created_at = new Date();
        courseData.creator_id = session.user.id;

        const { data, error } = await supabase
          .from('courses')
          .insert([courseData])
          .select();

        if (error) throw error;

        // Navigate to new course page
        navigate(`/course/edit/${data[0].id}`);
      } else {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);

        if (error) throw error;
      }

      alert(isNewCourse ? 'Course created successfully!' : 'Course updated successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Error saving course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isNewCourse ? 'Create New Course' : 'Edit Course'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={course.title}
            onChange={handleCourseChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter course title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Course Description
          </label>
          <textarea
            id="description"
            name="description"
            value={course.description}
            onChange={handleCourseChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Enter course description"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="level">
              Course Level
            </label>
            <select
              id="level"
              name="level"
              value={course.level}
              onChange={handleCourseChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="duration">
              Course Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={course.duration}
              onChange={handleCourseChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g. 2 weeks, 5 hours, Self-paced"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="cover_image">
            Course Cover Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="cover_image"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            
            {coverImagePreview && (
              <div className="ml-4">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="h-16 w-24 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveCourse}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {saving ? 'Saving...' : isNewCourse ? 'Create Course' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {!isNewCourse && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Lessons</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentLessonId ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="lesson_title">
                Lesson Title
              </label>
              <input
                type="text"
                id="lesson_title"
                name="title"
                value={currentLesson.title}
                onChange={handleLessonChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter lesson title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="lesson_content">
                Lesson Content
              </label>
              <textarea
                id="lesson_content"
                name="content"
                value={currentLesson.content}
                onChange={handleLessonChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                placeholder="Enter lesson content (HTML supported)"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="video_url">
                Video URL (optional)
              </label>
              <input
                type="url"
                id="video_url"
                name="video_url"
                value={currentLesson.video_url}
                onChange={handleLessonChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter video URL"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="lesson_duration">
                Lesson Duration (optional)
              </label>
              <input
                type="text"
                id="lesson_duration"
                name="duration"
                value={currentLesson.duration}
                onChange={handleLessonChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. 15 minutes"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCurrentLessonId(null);
                  setCurrentLesson(emptyLesson);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLesson}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {currentLessonId ? 'Update Lesson' : 'Add Lesson'}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Lesson List</h3>
            <p className="mb-2 text-gray-600 text-sm">Drag and drop to reorder lessons</p>
            
            {lessons.length === 0 ? (
              <p className="text-gray-500 italic">No lessons yet. Add your first lesson above.</p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <ul>
                  {lessons.map((lesson, index) => (
                    <li 
                      key={lesson.id} 
                      className="bg-white p-4 rounded-lg shadow mb-2 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                          </svg>
                        </div>
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div>
                        <button
                          onClick={() => editLesson(lesson)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLesson(lesson.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4">
              <button
                type="button"
                onClick={addNewLesson}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                + Add Another Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;