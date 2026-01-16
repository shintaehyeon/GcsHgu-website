import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  CheckCircle2,
  Globe,
  FileText,
  School,
  ChevronDown
} from 'lucide-react';

// --- Assets & Constants ---
const HGU_BLUE = "#003A78"; // Handong Royal Blue
const HGU_LOGO_URL = "/logo.png"; // Official Logo

// --- Components ---

// 1. Reusable Animation Wrapper (Fade Up)
const Section = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

// 2. Mascot 'G-C' Helper Component
const GCHelper = ({ text, position = "left" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className={`flex items-start gap-3 max-w-md ${position === 'center' ? 'mx-auto' : ''}`}
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-[#003A78] to-blue-500 text-white flex items-center justify-center font-bold shadow-lg z-10">
      GC
    </div>
    <div className="relative bg-white/80 backdrop-blur-sm border border-blue-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 leading-snug">
      <span className="text-[#003A78] font-bold block text-xs mb-1">Guide Tip</span>
      {text}
    </div>
  </motion.div>
);

// 3. Navigation Bar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <img src={HGU_LOGO_URL} alt="HGU Logo" className="h-10 w-auto" />
          <div className={`font-bold text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-[#003A78]'}`}>
            Global Creative
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          {['Curriculum', 'Admissions', 'Faculty', 'Notice'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#003A78] transition-colors">
              {item}
            </a>
          ))}
        </div>
        <button className="bg-[#003A78] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
          Apply Now
        </button>
      </div>
    </nav>
  );
};

export default function GCSWeb() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Navbar />

      {/* --- HERO SECTION with SPLINE --- */}
      <header className="relative w-full h-[90vh] bg-white overflow-hidden">
        {/* Spline Iframe */}
        <div className="absolute inset-0 z-0">
          <iframe
            src='https://my.spline.design/interactiveaiwebsite-tHNt62SRB9B2Qjud5JFSviT3/'
            frameBorder='0'
            width='100%'
            height='100%'
            className="w-full h-full"
            title="Spline 3D Scene"
            style={{ pointerEvents: 'all' }} // Enable interaction
          ></iframe>
        </div>

        {/* Hero Overlay Text */}
        <div className="absolute top-1/3 left-0 w-full z-10 pointer-events-none px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-3 py-1 bg-blue-50/80 backdrop-blur-md text-[#003A78] rounded-full text-xs font-bold tracking-wider mb-4 border border-blue-100">
                HANDONG GLOBAL UNIVERSITY
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#003A78] leading-tight mb-6 bg-clip-text">
                Global Creative <br /> School
              </h1>
              <p className="text-lg text-slate-600/90 font-medium max-w-lg bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                Cultivating global leaders with creativity and integrity.
                Explore the future of education with our interactive curriculum.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <ChevronDown className="text-[#003A78]" size={32} />
        </motion.div>

        {/* Gradient Fade to Content */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none"></div>
      </header>


      {/* --- SECTION 1: Curriculum (Bento Grid) --- */}
      <section id="curriculum" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <Section>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Curriculum <span className="text-[#003A78]">Architecture</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg">
              A systematic approach to learning. From foundational values to professional mastery.
            </p>
          </Section>
          <GCHelper text="Our curriculum is divided into three main stages. Don't miss the VWC course in the Cornerstone phase!" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">

          {/* Cornerstone */}
          <Section delay={0.1} className="bg-white p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003A78] mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Cornerstone</h3>
            <p className="text-slate-500 font-medium mb-6 text-sm uppercase tracking-wide">Foundation (10-20 Credits)</p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> VWC (CCE24001)</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Basic Design</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Value Formation</li>
            </ul>
          </Section>

          {/* Keystone (Highlighted) */}
          <Section delay={0.2} className="bg-[#003A78] p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,58,120,0.3)] text-white relative overflow-hidden md:-mt-8 md:mb-8 md:scale-105 z-10 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Keystone</h3>
              <p className="text-blue-200 font-medium mb-6 text-sm uppercase tracking-wide">Core Competency</p>
              <ul className="space-y-3 text-blue-50">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full" /> Advanced Major Courses</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full" /> English Lecture Mix</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full" /> Interdisciplinary Study</li>
              </ul>
            </div>
          </Section>

          {/* Capstone */}
          <Section delay={0.3} className="bg-white p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003A78] mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Capstone</h3>
            <p className="text-slate-500 font-medium mb-6 text-sm uppercase tracking-wide">Completion (30-40 Credits)</p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> FIT Program</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Field Internship</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Graduation Project</li>
            </ul>
          </Section>
        </div>
      </section>


      {/* --- SECTION 2: Process (Interactive Timeline) --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Application Process</h2>
            <p className="text-slate-500 mt-3">Your journey to GCS starts here.</p>
          </Section>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {[
                { step: "01", title: "Counseling", desc: "Advisor Meeting" },
                { step: "02", title: "Drafting", desc: "Fill Application" },
                { step: "03", title: "Review", desc: "Document Check" },
                { step: "04", title: "Evaluation", desc: "Faculty Committee" },
                { step: "05", title: "Approval", desc: "Final Decision" },
              ].map((item, index) => (
                <Section key={index} delay={index * 0.1} className="group">
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200">
                    <div className="w-10 h-10 mx-auto bg-slate-50 text-[#003A78] rounded-full flex items-center justify-center font-bold mb-4 group-hover:bg-[#003A78] group-hover:text-white transition-colors">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Section>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <GCHelper position="center" text="Make sure to complete the Counseling step before drafting your application!" />
          </div>
        </div>
      </section>


      {/* --- SECTION 3: Academic Rules --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <Section>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Academic <br />
              <span className="text-[#003A78]">Requirements</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              We offer flexible tracks to suit your academic goals. Whether you choose a Double Major or a Deep Major, GCS provides the path to expertise.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50/50 transition-colors">
                <Globe className="text-[#003A78] mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800">Global Exchange</h4>
                  <p className="text-sm text-slate-500">Credits earned abroad are recognized.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50/50 transition-colors">
                <FileText className="text-[#003A78] mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800">MOOC Credits</h4>
                  <p className="text-sm text-slate-500">Selected online courses accepted.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Cards */}
          <div className="space-y-6">
            <Section delay={0.2} className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-l-4 border-l-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Option A</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-2">Double Major</h3>
                </div>
                <span className="text-4xl font-black text-slate-200">33</span>
              </div>
              <p className="text-slate-500 mt-4 text-sm">Requires <strong>39-45 credits</strong> from the pool. Perfect for interdisciplinary studies.</p>
            </Section>

            <Section delay={0.4} className="bg-gradient-to-br from-[#003A78] to-[#002855] p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,58,120,0.4)] border-l-4 border-l-blue-400 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Option B</span>
                  <h3 className="text-2xl font-bold mt-2">Deep Major</h3>
                </div>
                <span className="text-4xl font-black text-white/30">66</span>
              </div>
              <p className="text-blue-100 mt-4 text-sm relative z-10">Requires <strong>75-84 credits</strong>. For students seeking deep expertise in the field.</p>
            </Section>
          </div>
        </div>
      </section>


      {/* --- FOOTER (Official Look) --- */}
      <footer className="bg-[#002046] text-white pt-20 pb-10 mt-12 border-t-4 border-[#003A78]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <School size={40} className="text-white" /> {/* Logo Icon */}
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Global Creative</h2>
                  <p className="text-blue-300 text-sm">Handong Global University</p>
                </div>
              </div>
              <p className="text-blue-200/80 text-sm leading-relaxed max-w-sm">
                558, Handong-ro, Heunghae-eup, Buk-gu, Pohang-si, Gyeongbuk, Republic of Korea<br />
                Tel: +82-54-260-1114 | Fax: +82-54-260-1114
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Course Handbook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scholarship Info</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">Connect</h4>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Youtube</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-blue-400">
            <p>&copy; 2024 Handong Global University. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
