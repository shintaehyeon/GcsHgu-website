/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Layers,
    Award,
    ArrowRight,
    CheckCircle2,
    Globe,
    FileText,
    School,
    Plus,
    Minus,
    X,
    User,
    Mail,
    Briefcase,
    Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Assets & Constants ---
const HGU_BLUE = "#003A78";
const HGU_LOGO_URL = "/logo.png";

// --- Components ---

// 1. Modal Component (Glassmorphism)
const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/90 backdrop-blur-xl w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border border-white/50 flex flex-col"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                        <h3 className="text-2xl font-bold text-[#003A78]">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// 2. Reusable Animation Wrapper (Fade Up)
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
const Navbar = ({ onOpenFaculty, onOpenResources }) => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(`/#${id}`);
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={HGU_LOGO_URL} alt="HGU Logo" className="h-10 w-auto" />
                    <div className={`font-bold text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-[#003A78]'}`}>
                        Global Convergence Studies
                    </div>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    {[
                        { label: 'Curriculum', id: 'curriculum' },
                        { label: 'Process', id: 'process' },
                        { label: 'Requirements', id: 'requirements' },
                        { label: 'Q&A', id: 'qa' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="hover:text-[#003A78] transition-colors focus:outline-none"
                        >
                            {item.label}
                        </button>
                    ))}
                    <Link to="/majors" className="hover:text-[#003A78] transition-colors">Majors</Link>
                    <button onClick={onOpenFaculty} className="hover:text-[#003A78] transition-colors focus:outline-none">Faculty</button>
                    <button onClick={onOpenResources} className="hover:text-[#003A78] transition-colors focus:outline-none">Resources</button>
                </div>
                <button
                    onClick={() => scrollToSection('process')}
                    className="bg-[#003A78] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                >
                    Apply Now
                </button>
            </div>
        </nav>
    );
};

// 4. Accordion Item for Q&A
const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-[#003A78]' : 'text-slate-700 group-hover:text-[#003A78]'}`}>
                    {question}
                </span>
                <span className={`flex-shrink-0 ml-4 p-1 rounded-full ${isOpen ? 'bg-blue-50 text-[#003A78]' : 'text-slate-400'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-slate-600 leading-relaxed text-sm md:text-base">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default function GCSPage() {
    const [facultyModalOpen, setFacultyModalOpen] = useState(false);
    const [resourcesModalOpen, setResourcesModalOpen] = useState(false);

    const facultyList = [
        { name: "Prof. Kyung-hwa Cho", role: "School Dean, CC Urban Planning", email: "khcho@handong.edu" },
        { name: "Prof. Edward Purnell", role: "CC Journalism", email: "epurnell@handong.edu" },
        { name: "Prof. David T.  S. Cho", role: "CC Political Studies", email: "dtcho@handong.edu" },
        { name: "Prof. Ja-young Kim", role: "CC Educational Leadership", email: "jayoung.kim@handong.edu" },
        { name: "Prof. Joseph  S.  Yi", role: "CC Political Studies", email: "joyi@handong.edu" },
        { name: "Prof. Jung-hwee Lee", role: "Associate Dean, CC Christian Studies", email: "jhlee@handong.edu" },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
            <Navbar
                onOpenFaculty={() => setFacultyModalOpen(true)}
                onOpenResources={() => setResourcesModalOpen(true)}
            />

            {/* Faculty Modal */}
            <Modal
                isOpen={facultyModalOpen}
                onClose={() => setFacultyModalOpen(false)}
                title="Faculty Advisors & Staff"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facultyList.map((faculty, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#003A78]">
                                <User size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{faculty.name}</h4>
                                <p className="text-[#003A78] text-sm font-semibold mb-2">{faculty.role}</p>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Mail size={14} />
                                    <span>{faculty.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Resources Modal */}
            <Modal
                isOpen={resourcesModalOpen}
                onClose={() => setResourcesModalOpen(false)}
                title="Resources & Forms"
            >
                <div className="space-y-4">
                    {[
                        { title: "Change of Major Form", desc: "Required for GCS major declaration", icon: FileText, link: "/change-of-major" },
                        { title: "GCS English Course List", desc: "Approved English-medium courses", icon: Globe, link: "/english-courses" },
                        { title: "VWC Course Syllabus", desc: "Course overview and requirements", icon: BookOpen, link: "/vwc-syllabus" },
                        { title: "FIT Program Guide", desc: "Field Internship guidelines", icon: Briefcase, link: "/fit-guide" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-sm transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#003A78] flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-[#003A78] transition-colors" />
                        </div>
                    ))}
                </div>
            </Modal>

            {/* --- HERO SECTION with SPLINE --- */}
            <header className="relative w-full h-[90vh] bg-white overflow-hidden">
                {/* Spline Iframe - ABSOLUTELY PRESERVED */}
                <div className="absolute inset-0 z-0">
                    <iframe
                        src='https://my.spline.design/interactiveaiwebsite-tHNt62SRB9B2Qjud5JFSviT3/'
                        frameBorder='0'
                        width='100%'
                        height='100%'
                        className="w-full h-full"
                        title="Spline 3D Scene"
                        style={{ pointerEvents: 'all' }}
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
                            <h1 className="text-5xl md:text-6xl font-extrabold text-[#003A78] leading-tight mb-2 tracking-tight">
                                Global Convergence Studies
                            </h1>
                            <p className="text-xl md:text-2xl font-bold text-slate-700/80 mb-6 leading-snug">
                                Design Your Own Major. <br />
                                Shape Your Own Future.
                            </p>
                            <p className="text-lg text-slate-600 font-medium max-w-lg leading-relaxed mb-8">
                                Create a personalized academic pathway that aligns with your calling, interests, and vocational goals — all in English at Handong Global University.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                                <Link to="/pillars" className="bg-[#4B89DC] hover:bg-[#3572C6] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                                    Explore the GCS Curriculum <ArrowRight size={20} />
                                </Link>
                                <button onClick={() => scrollToSection('process')} className="bg-white/60 backdrop-blur-md border border-white/60 text-[#003A78] px-8 py-3 rounded-full font-bold shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                                    How to Apply <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>



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
                    <Section delay={0.1} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003A78] mb-6">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cornerstone</h3>
                        <p className="text-slate-500 font-medium mb-6 text-sm uppercase tracking-wide">Foundation (10-20 Credits)</p>
                        <ul className="space-y-3 text-slate-600 mb-6">
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> VWC (CCE24001)</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Basic Design</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Value Formation</li>
                        </ul>
                        <Link to="/pillars" className="text-sm font-bold text-[#003A78] flex items-center gap-1 hover:underline">
                            View Pillar Details <ArrowRight size={14} />
                        </Link>
                    </Section>

                    {/* Keystone (Highlighted) */}
                    <Section delay={0.2} className="bg-[#003A78] p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,58,120,0.25)] text-white relative overflow-hidden md:-mt-8 md:mb-8 md:scale-105 z-10 flex flex-col justify-between transform transition-all hover:scale-110 duration-300">
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
                            <Link to="/majors" className="mt-8 text-sm font-bold text-blue-200 flex items-center gap-1 hover:text-white transition-colors">
                                View Major Examples <ArrowRight size={14} />
                            </Link>
                        </div>
                    </Section>

                    {/* Capstone */}
                    <Section delay={0.3} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003A78] mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Capstone</h3>
                            <p className="text-slate-500 font-medium mb-6 text-sm uppercase tracking-wide">Completion (30-40 Credits)</p>
                            <ul className="space-y-3 text-slate-600 mb-6">
                                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> FIT Program</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Field Internship</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#003A78]" /> Graduation Project</li>
                            </ul>
                            <Link to="/pillars" className="text-sm font-bold text-[#003A78] flex items-center gap-1 hover:underline">
                                View FIT Details <ArrowRight size={14} />
                            </Link>
                        </div>
                    </Section>
                </div>
            </section>


            {/* --- SECTION 2: Process (Interactive Timeline) --- */}
            <section id="process" className="py-20 bg-white border-y border-slate-100">
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
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 cursor-default">
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
            <section id="requirements" className="py-24 px-6 max-w-7xl mx-auto">
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
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-blue-50/50 transition-colors">
                                <Globe className="text-[#003A78] mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Global Exchange</h4>
                                    <p className="text-sm text-slate-500">Credits earned abroad are recognized.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-blue-50/50 transition-colors">
                                <FileText className="text-[#003A78] mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-800">MOOC Credits</h4>
                                    <p className="text-sm text-slate-500">Selected online courses accepted.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <GCHelper text="Check the handbook for specific MOOC platforms." />
                        </div>

                    </Section>

                    {/* Cards */}
                    <div className="space-y-6">
                        <Section delay={0.2} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 border-l-slate-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Option A</span>
                                    <h3 className="text-2xl font-bold text-slate-800 mt-2">Double Major</h3>
                                </div>
                                <span className="text-4xl font-black text-slate-200">33</span>
                            </div>
                            <p className="text-slate-500 mt-4 text-sm">Requires <strong>39-45 credits</strong> from the pool. Perfect for interdisciplinary studies.</p>
                        </Section>

                        <Section delay={0.4} className="bg-gradient-to-br from-[#003A78] to-[#002855] p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,58,120,0.25)] border-l-4 border-l-blue-400 text-white relative overflow-hidden">
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

            {/* --- SECTION 4: Why Choose GCS / Q&A --- */}
            <section id="qa" className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <Section className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why Choose GCS?</h2>
                        <p className="text-slate-500 mt-3">Common questions about the program structure and eligibility.</p>
                    </Section>

                    <Section className="space-y-2">
                        <AccordionItem
                            question="Is GCS just a free-form major?"
                            answer="Not exactly. While GCS allows for high flexibility, it requires a structured curriculum design. Students must demonstrate a clear academic theme and justify their course selection to ensure coherence and depth."
                        />
                        <AccordionItem
                            question="Who is GCS designed for?"
                            answer="GCS is designed for proactive students who have specific academic goals that cannot be met by existing single majors. It fits those who want to bridge multiple disciplines to create a unique expertise profile."
                        />
                        <AccordionItem
                            question="How do students define their academic theme?"
                            answer="Students work with an advisor to define a core theme. This theme acts as the 'thesis' of your major, guiding which courses are relevant. It must be specific enough to be meaningful but broad enough to allow diverse coursework."
                        />
                        <AccordionItem
                            question="Are there restrictions on course selection?"
                            answer="Yes. Courses must be 2000-level or higher (with some exceptions for foundational courses). At least 50% of credits must come from two different existing majors to ensure interdisciplinary breadth."
                        />
                        <AccordionItem
                            question="How is this different from a Second Major?"
                            answer="A standard Second Major follows a pre-set curriculum defined by the department. GCS allows you to 'build' the curriculum itself, tailoring it to a specific career path or research interest that doesn't exist yet as a standard major."
                        />
                        <AccordionItem
                            question="What is the review and approval timeline?"
                            answer="The application is reviewed by a faculty committee. This process typically takes 2-4 weeks after submission. Students are advised to start counseling at least one semester before they intend to declare the major."
                        />
                    </Section>
                </div>
            </section>


            {/* --- FOOTER (Refined & Minimal) --- */}
            <footer id="contact" className="bg-white border-t border-slate-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={HGU_LOGO_URL} alt="HGU Logo" className="h-8 w-auto grayscale opacity-80" />
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Global Convergence Studies</h2>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                Handong Global University<br />
                                558, Handong-ro, Heunghae-eup, Buk-gu, Pohang-si, Gyeongbuk, Republic of Korea
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Academic Calendar</a></li>
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Course Handbook</a></li>
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Scholarship Info</a></li>
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Contact Us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-[#003A78] transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                        <p>&copy; 2024 Handong Global University. All rights reserved.</p>
                        <div className="mt-2 md:mt-0">
                            <span className="opacity-70">Designed for GCS.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
