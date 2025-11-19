'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Layers, Zap, Globe, ChevronDown, Download } from 'lucide-react';
import { useRef } from 'react';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Navigation - Minimalist & Sticky */}
      <header className="fixed top-0 w-full bg-[#FDFDFD]/90 backdrop-blur-xl z-50 border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-serif font-bold rounded-none group-hover:rotate-180 transition-transform duration-500">D</div>
            <span className="font-serif text-lg tracking-wide font-semibold">DSEPPWEB</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide uppercase text-neutral-500">
            <Link href="#features" className="hover:text-black transition-colors duration-300">Features</Link>
            <Link href="/app" className="hover:text-black transition-colors duration-300">Archive</Link>
          </nav>
          <div className="flex items-center">
            <Link href="/app" className="relative overflow-hidden px-6 py-2.5 bg-black text-white text-sm font-medium tracking-wide uppercase group transition-all hover:bg-neutral-800">
              <span className="relative z-10 flex items-center gap-2">
                Enter Archive <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Serif Typography Focus */}
      <section className="relative pt-40 pb-32 md:pt-64 md:pb-48 px-6 overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-screen-xl mx-auto text-center z-10 relative"
        >
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           >
             <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[0.9] text-black mb-8">
               Academic <br/>
               <span className="italic text-neutral-400">Excellence</span>
             </h1>
           </motion.div>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide"
           >
             A curated digital archive of Hong Kong Diploma of Secondary Education past papers. Reimagined for clarity, speed, and focus.
           </motion.p>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
             className="flex justify-center"
           >
             <Link href="/app" className="group flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors duration-500">
                <span>Explore Collection</span>
                <ChevronDown className="w-4 h-4 animate-bounce duration-[2000ms]" />
             </Link>
           </motion.div>
        </motion.div>

        {/* Abstract Background Elements - Subtle & Classy */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
           <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-gradient-to-br from-neutral-100 to-transparent rounded-full blur-3xl" />
           <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vw] bg-gradient-to-tl from-neutral-100 to-transparent rounded-full blur-3xl" />
        </div>
      </section>

      {/* Showcase / Interface Preview - High-End Mockup */}
      <section className="py-0 px-4 md:px-12 relative z-20 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-screen-xl mx-auto"
        >
           <div className="relative aspect-[16/10] rounded rounded-t-xl border border-black/5 bg-white shadow-2xl shadow-black/5 overflow-hidden group cursor-default">
              {/* Browser Chrome */}
              <div className="h-10 bg-[#FDFDFD] border-b border-black/5 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                 </div>
              </div>
              
              {/* Mock Interface Content */}
              <div className="flex h-full bg-white pointer-events-none select-none">
                 {/* Sidebar Mock - Static & Realistic */}
                 <div className="w-64 border-r border-black/5 bg-[#FAFAFA] flex flex-col hidden md:flex">
                    <div className="p-6">
                        <div className="flex items-center gap-2 opacity-80 mb-6">
                            <div className="w-4 h-4 bg-black rounded-[2px] flex items-center justify-center text-[8px] text-white font-bold">D</div>
                            <span className="font-serif text-xs tracking-wide font-bold">DSEPPWEB</span>
                        </div>
                        <div className="space-y-1">
                            {['Mathematics', 'English Language', 'Physics', 'Chemistry'].map((sub, i) => (
                                <div key={sub} className={`px-3 py-2 rounded-md text-xs font-medium ${i === 0 ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}>
                                    {sub}
                                </div>
                            ))}
                            <div className="px-3 py-2 text-xs text-neutral-300">...</div>
                        </div>
                    </div>
                 </div>

                 {/* Main Content Mock */}
                 <div className="flex-1 p-8 md:p-12 flex flex-col">
                    <div className="flex justify-between items-start mb-10 border-b border-neutral-100 pb-6">
                       <div>
                          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Compulsory Part</div>
                          <h2 className="text-3xl font-serif text-black">Mathematics</h2>
                       </div>
                       <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
                            <div className="px-3 py-1 bg-white shadow-sm rounded text-[10px] font-medium">ENG</div>
                            <div className="px-3 py-1 text-neutral-400 text-[10px] font-medium">中文</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[2023, 2022, 2021, 2020].map((year) => (
                          <motion.div 
                            key={year}
                            whileHover={{ y: -5 }}
                            className="aspect-[4/3] bg-[#FAFAFA] border border-neutral-100 rounded-xl p-5 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-neutral-200 transition-all duration-300 group/card relative overflow-hidden"
                          >
                             <div className="text-3xl font-light text-neutral-300 group-hover/card:text-black transition-colors">{year}</div>
                             <div className="flex justify-between items-end">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Paper 1 & 2</div>
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
                                    <Download className="w-3 h-3" />
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
              
              {/* Overlay CTA - Now Clickable Link */}
              <Link href="/app" className="absolute inset-0 bg-white/0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="bg-black/90 backdrop-blur text-white px-6 py-3 rounded-full text-sm font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl hover:scale-105">
                    View Interactive Demo
                 </div>
              </Link>
           </div>
        </motion.div>
      </section>

      {/* Features - Grid Layout */}
      <section id="features" className="py-32 px-6 md:px-12 bg-[#FDFDFD]">
         <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
               <FeatureColumn 
                  icon={<Layers strokeWidth={1} />}
                  title="Structured"
                  desc="Intelligently organized by subject, year, and paper type. Find exactly what you need in seconds."
               />
               <FeatureColumn 
                  icon={<Zap strokeWidth={1} />}
                  title="Instant"
                  desc="Powered by modern web technologies for zero-latency navigation and instant downloads."
               />
               <FeatureColumn 
                  icon={<Globe strokeWidth={1} />}
                  title="Bilingual"
                  desc="Native support for both Chinese and English curriculums with a single toggle switch."
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-100 text-center">
         <p className="font-serif text-2xl italic text-neutral-300 mb-6">DSEPPWEB</p>
         <p className="text-xs text-neutral-400 uppercase tracking-widest">© {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );
}

function FeatureColumn({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 pt-8 md:pt-0 text-center md:text-left"
    >
       <div className="w-12 h-12 mx-auto md:mx-0 flex items-center justify-center text-black mb-6 bg-neutral-50 rounded-full">
          {icon}
       </div>
       <h3 className="font-serif text-2xl mb-4 text-black">{title}</h3>
       <p className="text-neutral-500 font-light leading-relaxed">
          {desc}
       </p>
    </motion.div>
  );
}
