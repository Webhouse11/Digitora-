import React from 'react';
import { Target, Users, Award, Shield, Briefcase, Globe, CheckCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="animate-fadeIn min-h-screen bg-brand-dark">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-b from-gray-900 to-brand-dark overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-900/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-8">
            Est. 2021
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8">
            Empowering the <br/>
            <span className="text-gold-500">Digital Economy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Digitora Studios is the premier educational bridge between retail investors and institutional-grade digital asset strategies. We don't just teach trading; we build careers.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-gold-500/30">
                <Target className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Our Mission</h3>
                <p className="text-gray-400">
                  To democratize access to high-level financial information. We believe that knowledge of DeFi, Forex, and Asset Tokenization shouldn't be locked behind the doors of Wall Street hedge funds.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Global Vision</h3>
                <p className="text-gray-400">
                  To create a borderless community of 1 million profitable traders and digital entrepreneurs by 2030, leveraging the power of Web3 and decentralized finance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-500/30">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Integrity First</h3>
                <p className="text-gray-400">
                  In an industry full of hype and scams, Digitora stands as a beacon of truth. We prioritize risk management, psychology, and sustainable growth over "get rich quick" schemes.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/20 blur-3xl transform rotate-6 rounded-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" 
              alt="Digitora Meeting" 
              className="relative rounded-2xl shadow-2xl border border-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-brand-card border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">15k+</div>
              <div className="text-sm text-gold-500 uppercase tracking-widest">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">120+</div>
              <div className="text-sm text-gold-500 uppercase tracking-widest">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">45+</div>
              <div className="text-sm text-gold-500 uppercase tracking-widest">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gold-500 uppercase tracking-widest">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Meet The Experts</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our curriculum is designed by industry veterans from top proprietary trading firms, blockchain developers, and financial analysts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Member 1 */}
          <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gold-500/50 transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                alt="CEO" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">James Sterling</h3>
              <p className="text-gold-400 text-sm mb-4">Founder & Lead Forex Strategist</p>
              <p className="text-gray-400 text-sm">
                Ex-institutional trader with 15 years of experience in FX and Commodities. Expert in macro-economic analysis.
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gold-500/50 transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="CTO" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">Sarah Chen</h3>
              <p className="text-gold-400 text-sm mb-4">Head of DeFi & Blockchain</p>
              <p className="text-gray-400 text-sm">
                Solidity developer and security auditor. Formerly at a top-tier DeFi protocol with $2B TVL.
              </p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gold-500/50 transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80" 
                alt="Analyst" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">Marcus Thorne</h3>
              <p className="text-gold-400 text-sm mb-4">Senior Technical Analyst</p>
              <p className="text-gray-400 text-sm">
                Specialist in Elliott Wave Theory and Market Structure. Mentored over 5,000 students in price action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gold-500 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-black mb-6">Ready to Start Your Journey?</h2>
          <p className="text-black/80 text-lg mb-8">
            Join Digitora Studios today and get access to the knowledge that the 1% use to build wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             {/* This button logic will be handled by parent to switch view */}
             <div className="text-black font-bold flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5" /> 100% Satisfaction Guarantee
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
