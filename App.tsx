
import React, { useState, useMemo, useEffect } from 'react';
import { COURSES } from './data/courses';
import { Course, CourseCategory } from './types';
import CourseCard from './components/CourseCard';
import PaymentModal from './components/PaymentModal';
import AIAdvisor from './components/AIAdvisor';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import AboutUs from './components/AboutUs';
import { Search, TrendingUp, BookOpen, Globe, LayoutGrid, Menu, X, Crown, Sparkles, ArrowRight } from 'lucide-react';

function App() {
  // --- State Management ---
  
  // Load initial courses. If we have saved download counts in localStorage, merge them.
  const [allCourses, setAllCourses] = useState<Course[]>(() => {
    try {
      const savedCounts = localStorage.getItem('digitora_download_counts');
      const counts = savedCounts ? JSON.parse(savedCounts) : {};
      
      // Merge static data with saved counts
      return COURSES.map(c => ({
        ...c,
        downloads: (c.downloads || 0) + (counts[c.id] || 0)
      }));
    } catch (e) {
      return COURSES;
    }
  });
  
  // Track Purchased Courses (Enrolled) with persistence
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('digitora_enrolled');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Save enrolled courses whenever they change
  useEffect(() => {
    localStorage.setItem('digitora_enrolled', JSON.stringify(Array.from(enrolledCourses)));
  }, [enrolledCourses]);
  
  // Navigation & View State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  // Views: 'home' (Standard Courses), 'about', 'special' (Premium Courses)
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'special'>('home');
  
  // User View State
  const [selectedCategory, setSelectedCategory] = useState<string>(CourseCategory.CRYPTO);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Exclude SPECIAL from standard home tabs to keep it exclusive
  const categories = Object.values(CourseCategory).filter(cat => cat !== CourseCategory.SPECIAL);

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      // Determine which category we are looking for based on View
      let categoryMatch = false;

      if (currentView === 'special') {
        // In Special View, ONLY show Special courses
        categoryMatch = course.category === CourseCategory.SPECIAL;
      } else if (currentView === 'home') {
        // In Home View, show selected category (excluding Special)
        categoryMatch = course.category === selectedCategory;
      }

      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && matchesSearch;
    });
  }, [selectedCategory, searchQuery, allCourses, currentView]);

  // --- Handlers ---

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (courseId: string) => {
    setEnrolledCourses(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      return newSet;
    });
    alert("Payment Successful! Course material is now available for download.");
  };

  const handleDownload = (course: Course) => {
    // Increment download count
    setAllCourses(prev => {
      const newCourses = prev.map(c => {
        if (c.id === course.id) {
          return { ...c, downloads: (c.downloads || 0) + 1 };
        }
        return c;
      });
      
      // Persist additional counts
      const counts: Record<string, number> = {};
      newCourses.forEach(c => {
        const original = COURSES.find(oc => oc.id === c.id);
        if (original) {
          const diff = (c.downloads || 0) - (original.downloads || 0);
          if (diff > 0) counts[c.id] = diff;
        }
      });
      localStorage.setItem('digitora_download_counts', JSON.stringify(counts));
      
      return newCourses;
    });
  };

  const handleAdminLogin = () => {
    setIsAdminMode(true);
    setIsAdminLoginOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleNavigate = (view: 'home' | 'about' | 'special', sectionId?: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    
    // Reset standard category if going home
    if (view === 'home' && !sectionId) {
       setSelectedCategory(CourseCategory.CRYPTO);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Scroll handling
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Admin CRUD Handlers
  const handleUpdateCourse = (updatedCourse: Course) => {
    setAllCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleAddCourse = (newCourse: Course) => {
    setAllCourses(prev => [newCourse, ...prev]);
  };

  const handleDeleteCourse = (id: string) => {
    setAllCourses(prev => prev.filter(c => c.id !== id));
  };

  // --- Render ---

  if (isAdminMode) {
    return (
      <AdminDashboard 
        courses={allCourses}
        onUpdateCourse={handleUpdateCourse}
        onAddCourse={handleAddCourse}
        onDeleteCourse={handleDeleteCourse}
        onExit={() => setIsAdminMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans bg-brand-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-brand-dark/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center transform rotate-3">
                <Globe className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-wide">
                Digitora<span className="text-gold-500">.</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigate('home')} 
                className={`transition-colors ${currentView === 'home' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}
              >
                Home
              </button>
              
              <button 
                onClick={() => handleNavigate('about')} 
                className={`transition-colors flex items-center gap-1 ${currentView === 'about' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}
              >
                About Us
              </button>

              <button 
                onClick={() => handleNavigate('home', 'courses')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Courses
              </button>
              
              <button 
                onClick={() => handleNavigate('special')}
                className={`flex items-center gap-2 transition-all group px-3 py-1 rounded-full border ${
                  currentView === 'special' 
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400' 
                    : 'border-transparent hover:border-gold-500/50 text-gold-500'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span className="font-semibold">Special Courses</span>
              </button>
              
              <button onClick={() => handleNavigate('home', 'features')} className="text-gray-300 hover:text-white transition-colors">Why Us</button>
              
              <button 
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-5 py-2 border border-gold-500 text-gold-400 rounded hover:bg-gold-500 hover:text-black transition-all font-semibold"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-card border-b border-gray-800 animate-fadeIn">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <button onClick={() => handleNavigate('home')} className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400">Home</button>
              <button onClick={() => handleNavigate('about')} className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400">About Us</button>
              <button onClick={() => handleNavigate('home', 'courses')} className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400">Courses</button>
              <button onClick={() => handleNavigate('special')} className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium text-gold-400 hover:text-white bg-gold-900/10 rounded">
                <Crown className="w-4 h-4" /> Special Courses
              </button>
              <button onClick={() => handleNavigate('home', 'features')} className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400">Why Us</button>
              <button 
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full mt-4 px-5 py-2 bg-gold-500 text-black font-bold rounded"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Main View Router --- */}
      
      {/* 1. ABOUT US PAGE */}
      {currentView === 'about' && <AboutUs />}

      {/* 2. SPECIAL COURSES PAGE */}
      {currentView === 'special' && (
        <div className="animate-fadeIn">
          {/* Special Header */}
          <div className="relative pt-32 pb-16 bg-black overflow-hidden border-b border-gold-900/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black" />
            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" /> Premium Collection
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                Elite Institutional <span className="text-gold-500">Mastery</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-8">
                High-ticket, advanced strategies for creating generational wealth. 
                Includes MEV Bots, Hedge Fund Structuring, and ZK-Rollup Architecture.
              </p>
            </div>
          </div>

          {/* Special Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-gray-400 italic">Showing {filteredCourses.length} Premium Courses</p>
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search premium courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gold-900/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-gold-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll} 
                  isEnrolled={enrolledCourses.has(course.id)}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. HOME PAGE (Standard Courses) */}
      {currentView === 'home' && (
        <div className="animate-fadeIn">
          {/* Hero Section */}
          <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
              <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-gold-400 text-sm font-medium mb-8 animate-fadeIn">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                New Courses Added: Tokenized Assets & Commodities
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
                Master the <span className="gradient-text">Digital Economy</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
                Professional education for Crypto, Forex, Stocks, Indices, NFTs, and DeFi. 
                Stop gambling. Start trading with institutional-grade strategies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#courses" 
                  onClick={(e) => { e.preventDefault(); handleNavigate('home', 'courses'); }}
                  className="px-8 py-4 bg-gold-500 text-black font-bold rounded hover:bg-gold-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                >
                  Explore Catalog
                </a>
                <button 
                  onClick={() => {
                    const element = document.querySelector('[aria-label="Ask AI"]');
                    if(element) (element as HTMLElement).click();
                  }}
                  className="px-8 py-4 bg-transparent border border-gray-600 text-white font-semibold rounded hover:border-gold-500 hover:text-gold-400 transition-all flex items-center gap-2"
                >
                  <LayoutGrid className="w-5 h-5" /> View Roadmap
                </button>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-10">
                {[
                  { label: 'Active Students', value: '15,000+' },
                  { label: 'Video Hours', value: '450+' },
                  { label: 'Expert Mentors', value: '12' },
                  { label: 'Success Rate', value: '94%' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Standard Course Section */}
          <section id="courses" className="py-20 bg-black/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-4">
                    Trending Courses
                  </h2>
                  <p className="text-gray-400">
                    Curated strategies specifically for the 2024-2025 market cycle.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search topics (e.g. 'DeFi', 'Options')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>

              {/* Categories (Excluding Special) */}
              <div className="flex overflow-x-auto pb-4 gap-2 mb-8 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-gold-500 text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEnroll={handleEnroll} 
                      isEnrolled={enrolledCourses.has(course.id)}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">No courses found</h3>
                  <p className="text-gray-500">Try adjusting your search or category filters.</p>
                </div>
              )}
              
              {/* Teaser for Special Courses */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-gold-900/50 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                 <h3 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Looking for Institutional Grade Strategies?</h3>
                 <p className="text-gray-400 mb-6 relative z-10">Access our exclusive collection of high-ticket courses on MEV Bots, Hedge Funds, and ZK-Rollups.</p>
                 <button 
                   onClick={() => handleNavigate('special')}
                   className="relative z-10 px-6 py-3 border border-gold-500 text-gold-400 font-bold rounded hover:bg-gold-500 hover:text-black transition-all flex items-center gap-2 mx-auto"
                 >
                   View Special Courses <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </section>

          {/* Features / Why Us */}
          <section id="features" className="py-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-6 bg-brand-card rounded-xl border border-gray-800 hover:border-gold-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Real-Time Strategies</h3>
                  <p className="text-gray-400">
                    Our curriculum is updated monthly. Strategies that worked in 2020 don't work today. We teach what works now.
                  </p>
                </div>
                <div className="p-6 bg-brand-card rounded-xl border border-gray-800 hover:border-gold-500/30 transition-colors">
                  <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
                  <p className="text-gray-400">
                    Join our Discord of 15,000+ traders. Share setups, network with entrepreneurs, and find alpha together.
                  </p>
                </div>
                <div className="p-6 bg-brand-card rounded-xl border border-gray-800 hover:border-gold-500/30 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                    <LayoutGrid className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Asset Diversity</h3>
                  <p className="text-gray-400">
                    We don't just teach Crypto. We teach how to diversify into Commodities, Indices, and Tokenized Real Estate.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center">
                  <Globe className="text-black w-5 h-5" />
                </div>
                <span className="text-xl font-serif font-bold text-white">Digitora.</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering the next generation of digital asset investors with institutional-grade education and tools.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Learn</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => handleNavigate('home', 'courses')} className="hover:text-gold-400">Crypto Fundamentals</button></li>
                <li><button onClick={() => handleNavigate('home', 'courses')} className="hover:text-gold-400">Forex Trading</button></li>
                <li><button onClick={() => handleNavigate('home', 'courses')} className="hover:text-gold-400">DeFi Mastery</button></li>
                <li><button onClick={() => handleNavigate('special')} className="hover:text-gold-400">Premium Courses</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-gold-400">About Us</button></li>
                <li><button onClick={() => handleNavigate('home', 'features')} className="hover:text-gold-400">Why Us</button></li>
                <li><a href="#" className="hover:text-gold-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gold-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Digitora Studios. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        course={selectedCourse} 
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />
      
      <AIAdvisor />
    </div>
  );
}

export default App;
