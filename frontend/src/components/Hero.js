import React from 'react';
import { Link } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HandymanIcon from '@mui/icons-material/Handyman';
import ShieldIcon from '@mui/icons-material/Shield';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import dashImg from '../assets/Dash.png';

const Hero = ({ onWatchDemo }) => {
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
        <div className="hidden md:flex items-center gap-6">
          <Link to="/choose" className="text-sm font-bold text-gray-800 hover:text-[#c09a47] transition-colors">
            Login
          </Link>
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
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div>
            <span className="text-[#c09a47] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 block">
              SMART SCHOOL MANAGEMENT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Georgia',_serif] text-[#1a1a1a] leading-[1.1] mb-6 font-bold">
            Modern School <br className="hidden lg:block" />
            Management, <br className="hidden lg:block" />
            Simplified.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-lg mb-10 leading-relaxed font-sans">
            Manage students, fees, reports, and certificates — all in one
            powerful yet easy-to-use system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
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
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 w-full text-left">
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
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">Secure &<br />Reliable</p>
            </div>
            <div className="flex flex-col gap-2 items-center text-center lg:items-start lg:text-left">
              <PeopleIcon className="text-[#c09a47]" fontSize="large" />
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">500+ Students Already Using</p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Mockup */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0 z-10">
          <div className="relative w-full max-w-[650px] flex items-center justify-center perspective-[1500px]">

            {/* Detailed Laptop Mockup (MacBook Style) */}
            <div className="relative w-full flex flex-col items-center" style={{ transform: 'rotateY(-15deg) rotateX(10deg)' }}>
              
              {/* Screen Bezel */}
              <div className="relative w-full rounded-t-[1.5rem] rounded-b-sm bg-[#181818] p-3 pb-6 shadow-2xl z-10 border border-[#2a2a2a] ring-1 ring-black/50">
                {/* Webcam Notch/Dot */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0a0a0a] ring-1 ring-[#222]"></div>
                
                {/* Screen Content */}
                <div className="w-full aspect-[16/10] bg-[#ffffff] rounded-lg overflow-hidden flex relative ring-1 ring-black/10">
                   <img 
                      src={dashImg} 
                      alt="School Admin Dashboard Laptop View" 
                      className="w-full h-full object-cover object-top"
                   />
                </div>

                {/* Bottom Bezel Logo Area */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#444] font-semibold tracking-wider">
                  OM SAAS
                </div>
              </div>

              {/* Keyboard Base / Deck */}
              <div className="relative w-[116%] h-6 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0] rounded-b-[1.5rem] rounded-t-sm -mt-[2px] z-20 flex justify-center border-t border-[#f5f5f5] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
                 {/* Thumb Indent */}
                 <div className="w-24 h-2.5 bg-gradient-to-b from-[#b0b0b0] to-[#999] rounded-b-lg shadow-inner mt-[1px]"></div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
