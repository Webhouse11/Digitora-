import React from 'react';
import { Course } from '../types';
import { Users, Star, ArrowRight, Download, CheckCircle } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  isEnrolled?: boolean;
  onDownload?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled, onDownload }) => {
  return (
    <div className={`group relative bg-brand-card border rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
      isEnrolled ? 'border-green-500/50 hover:border-green-400' : 'border-gray-800 hover:border-gold-500/50'
    }`}>
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all z-10" />
        <img 
          src={course.image} 
          alt={course.title} 
          onError={(e) => {
            // Fallback to a reliable generic tech/finance image if the specific one fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="bg-black/70 backdrop-blur-md text-gold-400 text-xs px-2 py-1 rounded border border-gold-500/30">
            {course.category}
          </span>
          {isEnrolled && (
             <span className="bg-green-600/90 text-white text-xs px-2 py-1 rounded border border-green-500 flex items-center gap-1">
               <CheckCircle className="w-3 h-3" /> Purchased
             </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
            course.level === 'Beginner' ? 'bg-green-900/30 text-green-400' :
            course.level === 'Intermediate' ? 'bg-blue-900/30 text-blue-400' :
            'bg-red-900/30 text-red-400'
          }`}>
            {course.level}
          </span>
          <div className="flex items-center text-gold-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs ml-1">{course.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-gold-400 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {course.description}
        </p>

        {/* Meta Stats */}
        <div className="flex items-center justify-between text-gray-500 text-xs mb-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {course.students.toLocaleString()}
            </div>
            <div className="flex items-center" title="Total Downloads">
              <Download className="w-3 h-3 mr-1" />
              {course.downloads?.toLocaleString() || 0}
            </div>
          </div>
          <div className={`font-bold text-lg ${isEnrolled ? 'text-green-400' : 'text-white'}`}>
            {isEnrolled ? 'Owned' : `$${course.price}`}
          </div>
        </div>

        {isEnrolled ? (
          <a 
            href={course.downloadUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => onDownload && onDownload(course)}
            className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Materials
          </a>
        ) : (
          <button 
            onClick={() => onEnroll(course)}
            className="w-full py-2 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold rounded hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Enroll Now <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;