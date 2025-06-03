import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import CreateCoursePage from '@/pages/CreateCoursePage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { CourseProvider } from '@/contexts/CourseContext.jsx';
import AccountConfirmed from '@/pages/AccountConfirmed';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/create-course" element={<CreateCoursePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/account-confirmed" element={<AccountConfirmed />} />
          </Routes>
          <Toaster />
        </Layout>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;