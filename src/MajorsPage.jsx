import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Globe, Users, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MajorCard = ({ title, icon: Icon, description, courses }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
        <div className="w-14 h-14 bg-gcs-50 rounded-2xl flex items-center justify-center text-[var(--fallback-remove-me-900, #2d4b15)] mb-6">
            <Icon size={28} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed italic">"{description}"</p>

        <div className="space-y-4">
            <h4 className="font-bold text-[var(--fallback-remove-me-900, #2d4b15)] text-sm uppercase tracking-wider">Example Courses</h4>
            <div className="flex flex-wrap gap-2">
                {courses.map((course, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-medium border border-slate-100">
                        {course}
                    </span>
                ))}
            </div>
        </div>
    </motion.div>
);

const MajorsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const majors = [
        {
            title: "CC Christian Studies",
            icon: Globe,
            description: "Preparing students for international Christian ministry and mission-focused careers.",
            courses: ["Systematic Theology", "Biblical Interpretation", "Missionary Anthropology", "Christian Ethics"]
        },
        {
            title: "CC Educational Leadership",
            icon: BookOpen,
            description: "Focusing on school administration, policy-making, and innovative teaching methodologies.",
            courses: ["Education Policy", "Curriculum Development", "Educational Psychology", "Organizational Leadership"]
        },
        {
            title: "CC Journalism",
            icon: MessageSquare,
            description: "Bridging communication studies with global media trends for the next-gen storytellers.",
            courses: ["Media Ethics", "Digital Storytelling", "International Reporting", "Communication Theory"]
        },
        {
            title: "CC Political Studies",
            icon: Users,
            description: "Analyzing global governance architectures and policy impact on international relations.",
            courses: ["Political Science 101", "Global Governance", "Public Policy Analysis", "Diplomacy & Strategy"]
        },
        {
            title: "CC Urban Planning",
            icon: MapPin,
            description: "Sustainable development and architectural integration for modern global cities.",
            courses: ["Urban Geography", "Sustainable Development", "Land Use Planning", "Infrastructure Design"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 py-12 px-6 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--fallback-remove-me-900, #2d4b15)] transition-colors mb-4 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium text-sm">Back to Home</span>
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            GCS <span className="text-[var(--fallback-remove-me-900, #2d4b15)]">Majors & Concentrations</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                        These are pre-approved concentration templates. You can customize these or propose your own academic theme.
                    </p>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {majors.map((major, index) => (
                        <MajorCard key={index} {...major} />
                    ))}

                    {/* Unique Design Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-[var(--fallback-remove-me-900, #2d4b15)] to-gcs-950 rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center border-4 border-gcs-400/30"
                    >
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
                            <Plus size={40} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Design Your Own</h3>
                        <p className="text-gcs-100 max-w-md mb-8">
                            GCS is ultimate flexibility. Combine modules from any two majors at HGU to create a path that fits your unique vision.
                        </p>
                        <button className="bg-white text-[var(--fallback-remove-me-900, #2d4b15)] px-8 py-3 rounded-full font-bold hover:bg-gcs-50 transition-colors">
                            Propose a Major
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default MajorsPage;
