import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Target, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PillarSection = ({ title, subtitle, icon: Icon, color, content, details }) => (
    <Section className="mb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <Icon size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{title}</h2>
                <p className="text-[var(--fallback-remove-me-900, #2d4b15)] font-bold text-lg mb-6">{subtitle}</p>
                <div className="text-slate-600 leading-relaxed space-y-4 text-lg">
                    {content.map((p, i) => <p key={i}>{p}</p>)}
                </div>
            </div>
            <div className="lg:w-1/2 w-full grid grid-cols-1 gap-4">
                {details.map((detail, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <ChevronRight size={18} className="text-[var(--fallback-remove-me-900, #2d4b15)]" />
                            {detail.label}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{detail.value}</p>
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

const Section = ({ children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={className}
    >
        {children}
    </motion.div>
);

const PillarsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--fallback-remove-me-900, #2d4b15)] transition-colors mb-4 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Core Pillars: <span className="text-[var(--fallback-remove-me-900, #2d4b15)]">VWC & FIT</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20">
                {/* VWC Pillar */}
                <PillarSection
                    title="VWC"
                    subtitle="Value, Worldview, and Calling"
                    icon={Sparkles}
                    color="bg-gradient-to-tr from-amber-400 to-orange-500"
                    content={[
                        "VWC is the foundational identity of GCS. It represents our commitment to academic excellence rooted in a clear sense of purpose and ethical responsibility.",
                        "Every GCS student must complete the VWC (CCE24001) course during their Cornerstone phase. This course helps students integrate their faith and values with their professional aspirations."
                    ]}
                    details={[
                        { label: "Core Course", value: "CCE24001 (Value, Worldview, and Calling) - 2 Credits" },
                        { label: "Goal", value: "Develop a personalized mission statement and academic roadmap aligned with student's values." },
                        { label: "Faculty Input", value: "Individual counseling sessions integrated into the course structure." }
                    ]}
                />

                {/* FIT Pillar */}
                <PillarSection
                    title="FIT"
                    subtitle="Field Internship and Training"
                    icon={Briefcase}
                    color="bg-gradient-to-tr from-gcs-500 to-[var(--fallback-remove-me-900, #2d4b15)]"
                    content={[
                        "FIT bridge the gap between academic theory and real-world practice. It is a mandatory requirement for all GCS majors to ensure they are prepared for the global job market.",
                        "Students can choose from domestic or international internships, research projects, or social contribution activities that align with their specialized academic theme."
                    ]}
                    details={[
                        { label: "Requirement", value: "Minimum 4-8 weeks of field experience or equivalent project work." },
                        { label: "Documentation", value: "Submit a Proposal before starting and a Reflective Report after completion." },
                        { label: "Support", value: "Access to HGU's global network of industry partners and NGOs." }
                    ]}
                />

                {/* Call to Action */}
                <Section className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-[var(--fallback-remove-me-900, #2d4b15)] to-gcs-500"></div>
                    <Target size={48} className="mx-auto text-[var(--fallback-remove-me-900, #2d4b15)] mb-6" />
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Your Journey?</h3>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-8 text-lg">
                        Browse our resource library for application forms and specific course guidelines to start building your unique major.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/" className="bg-[var(--fallback-remove-me-900, #2d4b15)] text-white px-8 py-3 rounded-full font-bold hover:bg-gcs-800 transition-colors">
                            Apply for GCS
                        </Link>
                    </div>
                </Section>
            </main>
        </div>
    );
};

export default PillarsPage;
