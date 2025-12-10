import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Link } from 'lucide-react';
import { Course, CourseCategory } from '../types';

interface CourseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  initialData?: Course | null;
}

const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 20,
    category: CourseCategory.CRYPTO,
    level: 'Beginner',
    rating: 5.0,
    students: 0,
    image: 'https://picsum.photos/800/600',
    tags: [],
    downloadUrl: ''
  });

  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setErrors({});
    if (initialData) {
      setFormData(initialData);
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      setFormData({
        id: `custom-${Date.now()}`,
        title: '',
        description: '',
        price: 20,
        category: CourseCategory.CRYPTO,
        level: 'Beginner',
        rating: 5.0,
        students: 0,
        image: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
        tags: [],
        downloadUrl: ''
      });
      setTagsInput('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    const urlPattern = /^https?:\/\/.+/i;

    // Validate Price
    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    // Validate Students
    if (formData.students === undefined || formData.students === null || isNaN(formData.students)) {
       newErrors.students = 'Students count is required';
    } else if (formData.students < 0) {
      newErrors.students = 'Students count cannot be negative';
    }

    // Validate Image URL (Required)
    if (!formData.image) {
      newErrors.image = 'Image URL is required';
    } else if (!urlPattern.test(formData.image)) {
      newErrors.image = 'Invalid URL (must start with http:// or https://)';
    }

    // Validate Download URL (Optional)
    if (formData.downloadUrl && !urlPattern.test(formData.downloadUrl)) {
      newErrors.downloadUrl = 'Invalid URL (must start with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const courseToSave = {
      ...formData,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    } as Course;
    
    onSave(courseToSave);
    onClose();
  };

  // Helper to safely get number value for input
  const getNumberValue = (val: number | undefined) => {
     if (val === undefined || isNaN(val)) return '';
     return val;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-brand-card border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-fadeIn custom-scrollbar">
        <div className="sticky top-0 bg-brand-card/95 backdrop-blur z-10 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Preview */}
          <div>
            <div className={`relative h-48 w-full rounded-lg overflow-hidden bg-gray-900 border group ${errors.image ? 'border-red-500' : 'border-gray-700'}`}>
              <img 
                src={formData.image || ''} 
                alt="Preview" 
                className="w-full h-full object-cover opacity-60" 
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Invalid+Image+URL')}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <input 
                type="text"
                value={formData.image || ''}
                onChange={e => {
                  setFormData({...formData, image: e.target.value});
                  if(errors.image) setErrors({...errors, image: ''});
                }}
                placeholder="Image URL (https://...)"
                className="absolute bottom-4 left-4 right-4 bg-black/70 border border-gray-600 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Course Title</label>
              <input 
                required
                type="text" 
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea 
                required
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as CourseCategory})}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
              >
                {Object.values(CourseCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Level</label>
              <select 
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value as any})}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={getNumberValue(formData.price)}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setFormData({...formData, price: isNaN(val) ? undefined : val});
                  if(errors.price) setErrors({...errors, price: ''});
                }}
                className={`w-full bg-gray-900 border rounded px-4 py-2 text-white focus:border-gold-500 outline-none ${errors.price ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Students Enrolled</label>
              <input 
                type="number" 
                min="0"
                value={getNumberValue(formData.students)}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setFormData({...formData, students: isNaN(val) ? undefined : val});
                  if(errors.students) setErrors({...errors, students: ''});
                }}
                className={`w-full bg-gray-900 border rounded px-4 py-2 text-white focus:border-gold-500 outline-none ${errors.students ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.students && <p className="text-red-500 text-xs mt-1">{errors.students}</p>}
            </div>

             <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Course Material URL (Download Link)</label>
              <div className="relative">
                <Link className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.downloadUrl ? 'text-red-500' : 'text-gray-500'}`} />
                <input 
                  type="text" 
                  value={formData.downloadUrl || ''}
                  onChange={e => {
                    setFormData({...formData, downloadUrl: e.target.value});
                    if(errors.downloadUrl) setErrors({...errors, downloadUrl: ''});
                  }}
                  placeholder="https://dropbox.com/..."
                  className={`w-full bg-gray-900 border rounded pl-10 pr-4 py-2 text-white focus:border-gold-500 outline-none ${errors.downloadUrl ? 'border-red-500' : 'border-gray-700'}`}
                />
              </div>
              {errors.downloadUrl && <p className="text-red-500 text-xs mt-1">{errors.downloadUrl}</p>}
              <p className="text-[10px] text-gray-500 mt-1">
                Admin Note: Paste the link to your hosted content.
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. DeFi, Bitcoin, Trading"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditorModal;