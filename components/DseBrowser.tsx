'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronRight, Search, X, FileText, FolderOpen, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SubjectData, YearData, FileItem } from '@/types';
import Link from 'next/link';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface DseBrowserProps {
  subjects: SubjectData[];
}

export default function DseBrowser({ subjects }: DseBrowserProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectData | null>(subjects[0] || null);
  const [language, setLanguage] = useState<'chi' | 'eng'>('chi');
  const [selectedYear, setSelectedYear] = useState<YearData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedExamType, setSelectedExamType] = useState<string>('All');

  // Auto-switch language if data is missing for current language
  useEffect(() => {
    if (!activeSubject) return;
    if (language === 'chi' && !activeSubject.chinese && activeSubject.english) {
      setLanguage('eng');
    } else if (language === 'eng' && !activeSubject.english && activeSubject.chinese) {
      setLanguage('chi');
    }
    setSelectedExamType('All'); // Reset filter on subject/language change
  }, [activeSubject, language]);

  const currentData = language === 'chi' ? activeSubject?.chinese : activeSubject?.english;
  const availableExamTypes = currentData?.map(e => e.type) || [];

  // Filter logic
  const filteredExamTypes = currentData?.filter(exam => 
    selectedExamType === 'All' || exam.type === selectedExamType
  ).map(exam => ({
    ...exam,
    years: exam.years.filter(y => 
      y.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      y.files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(exam => exam.years.length > 0);

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] text-[#1a1a1a] overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* Sidebar - Refined */}
      <aside className="w-72 bg-[#FAFAFA] border-r border-black/5 flex flex-col hidden md:flex shrink-0">
        <div className="p-8 pb-6">
          <Link href="/" className="flex items-center gap-3 opacity-100 group hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-serif font-bold rounded-none">D</div>
            <span className="font-serif text-sm tracking-wide font-bold">DSEPPWEB</span>
          </Link>
        </div>
        <div className="px-6 pb-2">
           <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-3 pl-2">Subjects</div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 scrollbar-thin scrollbar-thumb-neutral-200">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => setActiveSubject(subject)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-between group relative",
                activeSubject?.name === subject.name
                  ? "bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  : "text-neutral-500 hover:text-black hover:bg-black/5"
              )}
            >
              <span className="truncate relative z-10">{subject.name}</span>
              {activeSubject?.name === subject.name && (
                 <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-black rounded-r-full" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Header - Consistent with Landing */}
        <header className="h-20 px-8 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
           <div className="flex items-center gap-4 md:hidden">
             <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-serif font-bold">D</div>
           </div>
           
           {/* Top Tabs - Dynamic Exam Types (Text Style like Landing Page) */}
           <div className="hidden md:flex items-center gap-8 overflow-x-auto max-w-[600px] scrollbar-hide ml-4">
              <Link 
                href="/"
                className="text-xs font-medium tracking-widest uppercase transition-all whitespace-nowrap text-neutral-400 hover:text-black"
              >
                Home
              </Link>

              <div className="w-px h-3 bg-neutral-200 shrink-0" />

              <button 
                onClick={() => setSelectedExamType('All')}
                className={cn(
                  "text-xs font-medium tracking-widest uppercase transition-all whitespace-nowrap relative",
                  selectedExamType === 'All' 
                    ? "text-black" 
                    : "text-neutral-400 hover:text-black"
                )}
              >
                All
                {selectedExamType === 'All' && (
                  <motion.div layoutId="tabIndicator" className="absolute -bottom-2 left-0 right-0 h-px bg-black" />
                )}
              </button>
              {availableExamTypes.map(type => (
                <button 
                  key={type}
                  onClick={() => setSelectedExamType(type)}
                  className={cn(
                    "text-xs font-medium tracking-widest uppercase transition-all whitespace-nowrap relative",
                    selectedExamType === type
                      ? "text-black" 
                      : "text-neutral-400 hover:text-black"
                  )}
                >
                  {type}
                  {selectedExamType === type && (
                    <motion.div layoutId="tabIndicator" className="absolute -bottom-2 left-0 right-0 h-px bg-black" />
                  )}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-6 flex-1 justify-end">
              {/* Search - Minimalist */}
              <div className="relative w-full max-w-xs hidden sm:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="Search year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-transparent hover:border-neutral-200 focus:border-black/10 focus:bg-white rounded-full text-xs focus:outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Language Toggle - Intelligent Logic */}
              <div className="flex items-center gap-3 border-l border-neutral-200 pl-6">
                 {/* ENGLISH BUTTON */}
                 <button 
                   onClick={() => {
                     if (activeSubject?.english) setLanguage('eng');
                   }}
                   disabled={!activeSubject?.english}
                   className={cn(
                     "text-xs font-medium transition-colors relative group", 
                     language === 'eng' 
                       ? "text-black font-bold" 
                       : activeSubject?.english 
                         ? "text-neutral-400 hover:text-black cursor-pointer" 
                         : "text-neutral-300 cursor-not-allowed opacity-50"
                   )}
                   title={!activeSubject?.english ? "English version not available for this subject" : ""}
                 >
                   ENG
                   {!activeSubject?.english && (
                     <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-neutral-200 rounded-full" />
                   )}
                 </button>

                 <span className="text-neutral-300 text-[10px] font-light">/</span>

                 {/* CHINESE BUTTON */}
                 <button 
                   onClick={() => {
                     if (activeSubject?.chinese) setLanguage('chi');
                   }}
                   disabled={!activeSubject?.chinese}
                   className={cn(
                     "text-xs font-medium transition-colors relative group", 
                     language === 'chi' 
                       ? "text-black font-bold" 
                       : activeSubject?.chinese 
                         ? "text-neutral-400 hover:text-black cursor-pointer" 
                         : "text-neutral-300 cursor-not-allowed opacity-50"
                   )}
                   title={!activeSubject?.chinese ? "Chinese version not available for this subject" : ""}
                 >
                   中文
                   {!activeSubject?.chinese && (
                     <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-neutral-200 rounded-full" />
                   )}
                 </button>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto">
             {/* Subject Header */}
             <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Compulsory Part</div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-black tracking-tight">
                  {activeSubject?.name}
                </h2>
             </div>

             {!currentData ? (
                <div className="flex flex-col items-center justify-center py-32 text-neutral-300 border-2 border-dashed border-neutral-100 rounded-3xl">
                   <FolderOpen className="w-16 h-16 mb-4 text-neutral-200" strokeWidth={1} />
                   <p className="font-serif text-xl text-neutral-400">No papers available</p>
                </div>
             ) : (
                <div className="space-y-16">
                   {filteredExamTypes?.map((exam, idx) => (
                     <section key={exam.type} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                       <div className="flex items-center gap-4 mb-6">
                         <h3 className="text-lg font-serif font-medium text-black">
                           {exam.type}
                         </h3>
                         <div className="h-px flex-1 bg-neutral-100" />
                       </div>
                       
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                         {exam.years.map((year) => (
                           <button
                             key={year.year}
                             onClick={() => setSelectedYear(year)}
                             className="group relative aspect-[4/3] bg-[#FAFAFA] border border-black/5 rounded-xl p-6 flex flex-col justify-between hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:border-black/10 hover:-translate-y-1 transition-all duration-300 text-left"
                           >
                              <span className="text-4xl font-light text-neutral-300 group-hover:text-black transition-colors duration-300 font-sans">
                                {year.year}
                              </span>
                              <div className="flex items-end justify-between w-full">
                                 <span className="text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-neutral-500 transition-colors font-medium">
                                   {year.files.length} Documents
                                 </span>
                                 <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                   <Download className="w-3.5 h-3.5" />
                                 </div>
                              </div>
                           </button>
                         ))}
                       </div>
                     </section>
                   ))}
                   {filteredExamTypes?.length === 0 && (
                      <div className="text-center py-20 text-neutral-400 font-serif italic">
                        No matches found for "{searchQuery}"
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </main>

      {/* File Modal - Premium Style */}
      <AnimatePresence>
        {selectedYear && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedYear(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-xl max-h-[80vh] rounded-2xl shadow-2xl shadow-black/10 border border-black/5 overflow-hidden flex flex-col"
            >
               <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-white">
                 <div>
                   <h3 className="text-3xl font-serif text-black">{selectedYear.year}</h3>
                   <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">{activeSubject?.name}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedYear(null)}
                   className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
               
               <div className="overflow-y-auto p-4 space-y-1">
                 {selectedYear.files.map((file) => (
                   <a
                     key={file.path}
                     href={file.path}
                     download
                     className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 group transition-all duration-200 border border-transparent hover:border-black/5"
                   >
                     <div className="flex items-center gap-4 min-w-0">
                       <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-black group-hover:text-white transition-colors font-serif font-bold">
                         PDF
                       </div>
                       <div className="flex flex-col">
                         <span className="text-sm font-medium text-neutral-900 group-hover:text-black truncate">{file.name}</span>
                         <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Document</span>
                       </div>
                     </div>
                     <div className="px-4 py-1.5 bg-white border border-black/5 rounded-full text-[10px] font-medium text-neutral-500 shadow-sm group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                        Download
                     </div>
                   </a>
                 ))}
               </div>
               
               <div className="p-4 border-t border-black/5 bg-neutral-50/50 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Secure Download from DSEPPWEB Archive</span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
