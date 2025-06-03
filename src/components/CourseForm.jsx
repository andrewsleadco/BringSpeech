import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCourses } from '@/contexts/CourseContext';

const CourseForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCourse } = useCourses();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    lessons: [{ title: '', content: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setFormData(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const addLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', content: '' }]
    }));
  };

  const removeLesson = (index) => {
    if (formData.lessons.length === 1) {
      toast({
        title: "Cannot remove",
        description: "A course must have at least one lesson",
        variant: "destructive",
      });
      return;
    }
    
    const updatedLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if all lessons have titles
    const invalidLessons = formData.lessons.some(lesson => !lesson.title);
    if (invalidLessons) {
      toast({
        title: "Invalid lessons",
        description: "All lessons must have a title",
        variant: "destructive",
      });
      return;
    }

    // Create course
    const newCourse = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      createdAt: new Date().toISOString(),
      students: []
    };

    createCourse(newCourse);
    
    toast({
      title: "Course created!",
      description: "Your course has been successfully created",
    });
    
    navigate('/courses');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Course</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to Web Development"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of your course"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Programming"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price ($ USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00 for free courses"
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 4 weeks"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course Lessons</h2>
            <Button 
              type="button" 
              onClick={addLesson}
              variant="outline"
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Lesson
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.lessons.map((lesson, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-md relative"
              >
                <button
                  type="button"
                  onClick={() => removeLesson(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  aria-label="Remove lesson"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                
                <div className="mb-4">
                  <Label htmlFor={`lesson-title-${index}`}>Lesson Title *</Label>
                  <Input
                    id={`lesson-title-${index}`}
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    placeholder="e.g., Getting Started with HTML"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`lesson-content-${index}`}>Lesson Content</Label>
                  <Textarea
                    id={`lesson-content-${index}`}
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                    placeholder="Describe what this lesson will cover"
                    rows={3}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button type="button" variant="outline" onClick={() => navigate('/courses')}>
            Cancel
          </Button>
          <Button type="submit">Create Course</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CourseForm;