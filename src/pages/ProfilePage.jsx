import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import CourseCard from '@/components/CourseCard';
import UserAvatar from '@/components/UserAvatar';

const ProfilePage = () => {
  const { user, updateUser, login } = useAuth();
  const { getUserCourses } = useCourses();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  
  const { enrolled, created } = user ? getUserCourses(user.id) : { enrolled: [], created: [] };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(profileData);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please log in to view and manage your profile
        </p>
        <Button size="lg" onClick={login}>
          Log in
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="hero-gradient h-32 relative"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
            <UserAvatar user={user} className="h-24 w-24 border-4 border-white shadow-md" />
            <div className="mt-4 md:mt-0 md:ml-6 md:mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <p className="text-gray-600">{user.bio || 'No bio provided yet.'}</p>
        </div>
      </div>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="created">Created Courses</TabsTrigger>
          <TabsTrigger value="settings">Profile Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <h2 className="text-2xl font-bold mb-6">Enrolled Courses</h2>
          {enrolled.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
              <Button onClick={() => window.location.href = '/courses'}>Browse Courses</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolled.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="created">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Created Courses</h2>
            <Button onClick={() => window.location.href = '/create-course'}>
              Create New Course
            </Button>
          </div>
          
          {created.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
              <Button onClick={() => window.location.href = '/create-course'}>Create Your First Course</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {created.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfilePage;