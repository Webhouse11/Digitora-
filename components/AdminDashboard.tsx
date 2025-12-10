import React, { useState } from 'react';
import { Course } from '../types';
import { Plus, Edit, Trash2, LogOut, Search, MoreHorizontal, LayoutDashboard } from 'lucide-react';
import CourseEditorModal from './CourseEditorModal';

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourse: (course: Course) => void;
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  courses, 
  onUpdateCourse, 
  onAddCourse, 
  onDeleteCourse,
  onExit 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    setIsEditorOpen(true);
  };

  const handleSave = (course: Course) => {
    if (editingCourse) {
      onUpdateCourse(course);
    } else {
      onAddCourse(course);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans">
      {/* Sidebar / Topbar for Mobile */}
      <nav className="bg-brand-card border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-black w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gold-500">Digitora Studios Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onExit}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Mode</span>
              </button>
              <button 
                onClick={handleAddNew}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Course</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-card border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-white mt-1">{courses.length}</p>
          </div>
          <div className="bg-brand-card border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Average Price</p>
            <p className="text-3xl font-bold text-gold-400 mt-1">
              ${(courses.reduce((acc, c) => acc + c.price, 0) / courses.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-brand-card border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">
              {courses.reduce((acc, c) => acc + c.students, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-card border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-brand-card border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-800">
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Students</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-12 h-12 rounded object-cover border border-gray-700"
                        />
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-1">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700">
                        {course.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-gold-400">
                      ${course.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {course.students.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(course)}
                          className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this course?')) {
                              onDeleteCourse(course.id);
                            }
                          }}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No courses found matching your search.
            </div>
          )}
        </div>
      </main>

      <CourseEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialData={editingCourse}
      />
    </div>
  );
};

export default AdminDashboard;