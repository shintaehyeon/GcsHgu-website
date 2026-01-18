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
    Plus,
    Minus,
    X,
    User,
    Mail,
    Briefcase,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
const Navbar = ({ onOpenFaculty, onOpenResources, onOpenMajors }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
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

    const navItems = [
        { label: 'Curriculum', id: 'curriculum' },
        { label: 'Process', id: 'process' },
        { label: 'Requirements', id: 'requirements' },
        { label: 'Why GCS', id: 'why-gcs' }
    ];

    const NavButton = ({ onClick, label, id }) => (
        <button
            onClick={onClick}
            className="relative group py-2 focus:outline-none"
        >
            <span className={`uppercase tracking-widest text-[11px] font-medium transition-all duration-300 group-hover:font-extrabold ${scrolled ? 'text-slate-600 hover:text-[#003A78]' : 'text-slate-200 hover:text-white'}`}>
                {label}
            </span>
            <motion.span
                className={`absolute bottom-0 left-0 w-0 h-[2px] ${scrolled ? 'bg-[#003A78]' : 'bg-white'} transition-all duration-300 group-hover:w-full`}
            />
        </button>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo & Title */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                    <div className="relative overflow-hidden rounded-lg">
                        <img src={HGU_LOGO_URL} alt="HGU Logo" className="h-9 w-auto transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-black text-lg leading-none tracking-tighter ${scrolled ? 'text-[#003A78]' : 'text-white'}`}>
                            GCS
                        </span>
                        <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${scrolled ? 'text-slate-400' : 'text-blue-200/60'}`}>
                            Handong Global University
                        </span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <NavButton key={item.id} onClick={() => scrollToSection(item.id)} label={item.label} />
                    ))}
                    <div className={`w-[1px] h-4 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`} />
                    <NavButton onClick={onOpenMajors} label="Majors" />
                    <NavButton onClick={onOpenFaculty} label="Faculty & Advisors" />
                    <NavButton onClick={onOpenResources} label="Resources" />
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <a
                        href="https://hisnet.handong.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-300 ${scrolled
                            ? 'text-[#003A78] hover:bg-blue-50'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        HISNET
                    </a>
                    <button
                        onClick={() => scrollToSection('process')}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-lg hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 ${scrolled
                            ? 'bg-[#003A78] text-white hover:bg-blue-800'
                            : 'bg-white text-[#003A78] hover:bg-blue-50'
                            }`}
                    >
                        Apply Now
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-xl transition-colors focus:outline-none"
                >
                    {isMenuOpen ? (
                        <X size={26} className={scrolled ? 'text-slate-900' : 'text-white'} />
                    ) : (
                        <Menu size={26} className={scrolled ? 'text-slate-900' : 'text-white'} />
                    )}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-left text-lg font-bold text-slate-800 hover:text-[#003A78] transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="h-[1px] bg-slate-100" />
                            <button onClick={onOpenMajors} className="text-left text-lg font-bold text-slate-800 hover:text-[#003A78]">Majors</button>
                            <button onClick={onOpenFaculty} className="text-left text-lg font-bold text-slate-800 hover:text-[#003A78]">Faculty & Advisors</button>
                            <button onClick={onOpenResources} className="text-left text-lg font-bold text-slate-800 hover:text-[#003A78]">Resources</button>

                            <div className="flex flex-col gap-3 mt-4">
                                <a
                                    href="https://hisnet.handong.edu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 text-center text-sm font-black uppercase tracking-widest text-[#003A78] bg-blue-50 rounded-2xl"
                                >
                                    HISNET
                                </a>
                                <button
                                    onClick={() => scrollToSection('process')}
                                    className="w-full py-4 text-center text-sm font-black uppercase tracking-widest text-white bg-[#003A78] rounded-2xl shadow-lg shadow-blue-900/20"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
    const [majorsModalOpen, setMajorsModalOpen] = useState(false);

    const facultyList = [
        {
            name: "Prof. Scott Lincoln",
            koreanName: "스캇 링컨",
            major: "Ph.D. in Organizational Leadership, Regent University",
            office: "Nehemiah Hall, Room 112",
            phone: "054-260-1298",
            email: "slincoln@handong.edu",
            image: "/faculty/scott_lincoln.jpg"
        },
        {
            name: "Prof. Jenny Kim",
            koreanName: "제니 김",
            major: "Ed.D, University of Southern California",
            office: "Oseok Hall, Room 421B",
            phone: "054-260-1506",
            email: "jennykim@handong.edu",
            image: "/faculty/jenny_kim.jpg"
        },
        {
            name: "Prof. Bryan Alkema",
            koreanName: "브라이언 알케마",
            major: "M.A. Applied Linguistics, University of Southern Queensland",
            office: "GLC, Room 208",
            phone: "054-260-1345",
            email: "bryan@handong.edu",
            image: "/faculty/bryan_alkema.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
            <Navbar
                onOpenFaculty={() => setFacultyModalOpen(true)}
                onOpenResources={() => setResourcesModalOpen(true)}
                onOpenMajors={() => setMajorsModalOpen(true)}
            />

            {/* Faculty Modal */}
            <Modal
                isOpen={facultyModalOpen}
                onClose={() => setFacultyModalOpen(false)}
                title="Faculty & Advisors"
            >
                <div className="space-y-12">
                    {facultyList.map((faculty, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-slate-100">
                                <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full md:w-2/3">
                                <h4 className="text-3xl font-bold text-[#003A78] mb-1">{faculty.name}</h4>
                                <p className="text-slate-500 font-medium mb-6">{faculty.koreanName}</p>

                                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-100 text-left">
                                            <tr className="bg-slate-50/50">
                                                <td className="px-4 py-3 font-bold text-slate-700 w-32 border-r border-slate-100">Expertise</td>
                                                <td className="px-4 py-3 text-slate-600">{faculty.major}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-100">Office</td>
                                                <td className="px-4 py-3 text-slate-600">{faculty.office}</td>
                                            </tr>
                                            <tr className="bg-slate-50/50">
                                                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-100">Phone</td>
                                                <td className="px-4 py-3 text-slate-600">{faculty.phone}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-100">Email</td>
                                                <td className="px-4 py-3 text-[#003A78] font-medium leading-none">{faculty.email}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-6 text-slate-500 text-sm italic leading-relaxed">
                                    Dedicated to providing interdisciplinary mentorship and guiding students through their personalized academic journey in GCS.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Majors Modal (Placeholder for future expansion) */}
            <Modal
                isOpen={majorsModalOpen}
                onClose={() => setMajorsModalOpen(false)}
                title="Majors & Academic Pathways"
            >
                <div className="p-4 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003A78] mx-auto mb-6">
                        <BookOpen size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Design Your Custom Major</h4>
                    <p className="text-slate-600 max-w-lg mx-auto mb-8">
                        The Global Convergence School allows you to combine multiple disciplines to create a unique major that fits your calling.
                        Past student-designed majors include:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {[
                            "Studies in Education",
                            "Christian Studies",
                            "Urban Planning",
                            "Artificial Intelligence and Data Science",
                            "Film Studies",
                            "Culture and Conflict Resolution",
                            "International Finance Administration",
                            "Visual Communication and Design",
                            "International Human Services Administration"
                        ].map((major, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-semibold text-[#003A78]">
                                {major}
                            </div>
                        ))}
                    </div>
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
                                GCS is not just a major; it's a program that allows you to design your own 100% English-mediated major, different from any official programs at HGU. Expand your choices and shape your future with personalized academic pathways.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                                <button onClick={() => setMajorsModalOpen(true)} className="bg-[#4B89DC] hover:bg-[#3572C6] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                                    Explore the GCS Curriculum <ArrowRight size={20} />
                                </button>
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
                        <button onClick={() => setMajorsModalOpen(true)} className="text-sm font-bold text-[#003A78] flex items-center gap-1 hover:underline">
                            View Pillar Details <ArrowRight size={14} />
                        </button>
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
                            <button onClick={() => setMajorsModalOpen(true)} className="mt-8 text-sm font-bold text-blue-200 flex items-center gap-1 hover:text-white transition-colors">
                                View Major Examples <ArrowRight size={14} />
                            </button>
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
                            <button onClick={() => setMajorsModalOpen(true)} className="text-sm font-bold text-[#003A78] flex items-center gap-1 hover:underline">
                                View FIT Details <ArrowRight size={14} />
                            </button>
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
                            GCS assists you in creating a unique major so that you receive a Bachelor of Arts (BA) or Bachelor of Science (BS) degree that prepares you for your career or graduate school.
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
                            <p className="text-slate-500 mt-4 text-sm">Requires <strong>33 credits</strong> from your self-designed GCS course pool. Perfect for interdisciplinary studies.</p>
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
                            <p className="text-blue-100 mt-4 text-sm relative z-10">Requires <strong>66 credits</strong> from your pool. For students seeking deep expertise in their self-designed field.</p>
                        </Section>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: Why GCS --- */}
            <section id="why-gcs" className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <Section className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why GCS?</h2>
                        <p className="text-slate-500 mt-3">Understanding the unique advantages of our program structure.</p>
                    </Section>

                    <Section className="space-y-2">
                        <AccordionItem
                            question="What does GCS offer international students?"
                            answer="GCS opens up the opportunity for international students to widely expand their choice of majors that can be created and taken entirely in English, addressing the limited fixed English-mediated majors."
                        />
                        <AccordionItem
                            question="What degree will I receive?"
                            answer="You can graduate with either a Bachelor of Arts (BA) or Bachelor of Science (BS) degree, depending on the nature of the self-designed major you create."
                        />
                        <AccordionItem
                            question="Is 'Global Convergence Studies' the name of the major?"
                            answer="GCS itself is not a major; it is a program that helps you design your own unique major. Your transcript will reflect the specific major you designed (e.g., 'Studies in Education')."
                        />
                        <AccordionItem
                            question="How much support do I get in designing my major?"
                            answer="We walk with you throughout the whole program! Skilled and experienced GCS professors provide 1:1 mentoring to guide and assist you while you create your major and prepare for career success."
                        />
                        <AccordionItem
                            question="What are some examples of past self-designed majors?"
                            answer="Past students have designed majors in Christian Studies, Urban Planning, AI and Data Science, Film Studies, Conflict Resolution, International Finance, and more."
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
