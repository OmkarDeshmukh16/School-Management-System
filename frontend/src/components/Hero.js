import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HandymanIcon from '@mui/icons-material/Handyman';
import ShieldIcon from '@mui/icons-material/Shield';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Hero = ({ onWatchDemo }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#fcfbfa] overflow-hidden z-0">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between max-w-7xl mx-auto right-0">
        <div className="flex items-center gap-2 cursor-pointer">
           <MenuBookIcon className="text-[#c09a47]" fontSize="large" />
           <span className="font-['Georgia',_serif] font-bold text-lg tracking-wider text-[#1a1a1a]">OM SAAS SOLUTION</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700">
           <a href="#features" className="hover:text-[#c09a47] transition-colors">Features</a>
           <a href="#modules" className="hover:text-[#c09a47] transition-colors">Modules</a>
           <a href="#pricing" className="hover:text-[#c09a47] transition-colors">Pricing</a>
           <a href="#about" className="hover:text-[#c09a47] transition-colors">About Us</a>
           <a href="#contact" className="hover:text-[#c09a47] transition-colors">Contact</a>
        </div>
        <div className="hidden md:block">
           <Link to="/request-demo">
              <button className="px-6 py-2.5 bg-[#111] hover:bg-[#222] text-white font-sans font-bold text-sm tracking-wide rounded-[4px] shadow-md transition-all">
                Request Demo
              </button>
           </Link>
        </div>
      </nav>

      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f7ecd6] rounded-full blur-[120px] opacity-70 -translate-y-1/4 translate-x-1/4 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f7ecd6] rounded-full blur-[100px] opacity-60 translate-y-1/4 -translate-x-1/4 -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-32 pb-20">
        
        {/* Left Column: Content */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="text-[#c09a47] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 block">
              SMART SCHOOL MANAGEMENT
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-['Georgia',_serif] text-[#1a1a1a] leading-[1.1] mb-6 font-bold"
          >
            Modern School <br className="hidden lg:block" />
            Management, <br className="hidden lg:block" />
            Simplified.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-gray-600 max-w-lg mb-10 leading-relaxed font-sans"
          >
            Manage students, fees, reports, and certificates — all in one 
            powerful yet easy-to-use system.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
            <Link to="/request-demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#111] hover:bg-[#222] text-white font-sans font-bold text-sm tracking-wide rounded-[4px] shadow-lg transition-all flex items-center justify-center gap-2">
                REQUEST DEMO <ArrowForwardIcon fontSize="small" />
              </button>
            </Link>
            <button 
              onClick={onWatchDemo}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-[#111] font-sans font-bold text-sm tracking-wide rounded-[4px] transition-all flex items-center justify-center gap-2"
            >
              <PlayCircleOutlineIcon fontSize="small" /> WATCH DEMO
            </button>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 w-full text-left">
            <div className="flex flex-col gap-2 items-center text-center lg:items-start lg:text-left">
              <VerifiedUserIcon className="text-[#c09a47]" fontSize="large" />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">Trusted by Schools Across Maharashtra</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center lg:items-start lg:text-left">
              <HandymanIcon className="text-[#c09a47]" fontSize="large" />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">No Technical Setup Required</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center lg:items-start lg:text-left">
              <ShieldIcon className="text-[#c09a47]" fontSize="large" />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">Secure &<br/>Reliable</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center lg:items-start lg:text-left">
              <PeopleIcon className="text-[#c09a47]" fontSize="large" />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">500+ Students Already Using</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0 perspective-[1200px] z-10"
        >
          <motion.div variants={floatingVariants} animate="animate" className="relative w-full max-w-[650px] flex items-center justify-center">
            
            {/* Laptop Mockup */}
            <div className="relative w-full rounded-2xl bg-[#1e1e1e] p-3 shadow-2xl z-10" style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}>
              {/* Screen */}
              <div className="w-full aspect-[16/10] bg-[#f5f6f8] rounded-xl overflow-hidden flex relative border border-gray-700/50">
                 {/* Replace this src with your actual laptop screenshot path */}
                 <img 
                    src="/assets/laptop-dashboard.png" 
                    alt="School Admin Dashboard Laptop View" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x500/1a1a1a/ffffff?text=Add+Laptop+Screenshot+Here+src/assets/laptop-dashboard.png";
                    }}
                 />
              </div>
              {/* Laptop Bottom Lip */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[112%] h-3 bg-[#c4c4c4] rounded-b-xl shadow-xl flex justify-center">
                 <div className="w-1/6 h-1 bg-[#a3a3a3] rounded-b-md"></div>
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="absolute -bottom-8 -right-4 lg:-right-12 z-20 w-[140px] md:w-[170px] rounded-[2rem] bg-[#111] p-2 shadow-2xl border-2 border-gray-600">
              <div className="w-full aspect-[9/19] bg-[#f8f9fc] rounded-[1.5rem] overflow-hidden relative border border-gray-300">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-4 bg-[#111] rounded-b-xl z-10"></div>
                {/* Replace this src with your actual mobile screenshot path */}
                <img 
                    src="/assets/mobile-dashboard.png" 
                    alt="School Admin Dashboard Mobile View" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x600/1a1a1a/ffffff?text=Add+Mobile+Screenshot";
                    }}
                 />
              </div>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
