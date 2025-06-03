import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedCategories from '@/components/FeaturedCategories';
import CourseList from '@/components/CourseList';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CourseList title="Featured Courses" limit={3} />
      </div>
      <FeaturedCategories />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;