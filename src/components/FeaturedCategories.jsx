import React from 'react';
import { motion } from 'framer-motion';
import { Code, PenTool, BookOpen, Database, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Programming',
    icon: <Code className="h-8 w-8" />,
    color: 'bg-blue-100 text-blue-600',
    description: 'Learn coding and software development',
  },
  {
    name: 'Design',
    icon: <PenTool className="h-8 w-8" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Master graphic and UI/UX design',
  },
  {
    name: 'Business',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Develop entrepreneurship skills',
  },
  {
    name: 'Data Science',
    icon: <Database className="h-8 w-8" />,
    color: 'bg-green-100 text-green-600',
    description: 'Analyze and visualize data',
  },
  {
    name: 'Languages',
    icon: <Globe className="h-8 w-8" />,
    color: 'bg-red-100 text-red-600',
    description: 'Learn new languages fluently',
  },
  {
    name: 'Technology',
    icon: <Cpu className="h-8 w-8" />,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Explore emerging technologies',
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the perfect course for you across our diverse range of categories
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/courses?category=${category.name}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="p-6">
                    <div className={`inline-flex rounded-full p-3 ${category.color} mb-4`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;