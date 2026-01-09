import React from 'react';
import { BrainCircuit, AlertOctagon } from 'lucide-react';
import { audioManager } from '../utils/audioSystem';

interface HeroProps {
  isLightMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ isLightMode }) => {
  const textColor = isLightMode ? 'text-slate-900' : 'text-white';
  const subTextColor = isLightMode ? 'text-slate-600' : 'text-gray-300';
  const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-xl' : 'bg-slate-900/50 border-slate-700 backdrop-blur-sm';
  const cardTitle = isLightMode ? 'text-slate-800' : 'text-white';
  const cardText = isLightMode ? 'text-slate-500' : 'text-gray-400';

  const scrollToSection = (id: string) => {
    audioManager.playClick();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header (approx 80px)
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${isLightMode ? 'bg-blue-200/40' : 'bg-blue-500/10'}`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${isLightMode ? 'bg-purple-200/40' : 'bg-purple-500/10'}`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm mb-8 backdrop-blur-sm ${isLightMode ? 'bg-white/60 border-slate-200 text-blue-600' : 'bg-slate-800/80 border-slate-700 text-blue-400'}`}>
          <BrainCircuit size={16} />
          <span>Interactive AI Logic Visualizer</span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-sm ${textColor}`}>
          Why "Smart" AI Makes <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Stupid Mistakes</span>
        </h1>
        
        <p className={`mt-4 max-w-2xl mx-auto text-xl leading-relaxed ${subTextColor}`}>
          Asking an AI for a quick answer is a gamble. Without <strong>Thinking Mode</strong>, neural networks hallucinate. See the difference between a <span className="text-red-400 font-bold">Fatal Error</span> and <span className="text-blue-500 font-bold">Chain of Thought</span> reasoning.
        </p>

        <div className="mt-10 flex justify-center gap-4 relative z-50">
          <button 
            onClick={() => scrollToSection('demo')}
            className="group px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:-translate-y-1 duration-300 hover:animate-aura relative shadow-lg shadow-blue-500/30"
          >
            <span className="group-hover:animate-[shake_0.5s_ease-in-out]">Try the Interactive Demo</span>
          </button>
          <button 
            onClick={() => scrollToSection('scientific-dive')}
            className={`group px-8 py-4 rounded-lg font-semibold transition-all border hover:-translate-y-1 duration-300 hover:animate-aura ${isLightMode ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'}`}
          >
            <span className="group-hover:animate-[shake_0.5s_ease-in-out]">Learn the Science</span>
          </button>
        </div>
      </div>
      
      {/* Educational Cards */}
      <div className="relative z-10 max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className={`${cardBg} p-8 rounded-2xl border ${isLightMode ? 'border-red-100 hover:border-red-200 shadow-red-100/50' : 'border-red-500/20 hover:border-red-500/40'} transition-all group hover:shadow-lg`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isLightMode ? 'bg-red-50' : 'bg-red-500/10'}`}>
                <AlertOctagon className="text-red-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${cardTitle}`}>The "Fatal Error" Risk</h3>
            <p className={cardText}>
                When you ask "Just give me the number," the AI tries to predict the final digits immediately. It's like asking a human to do advanced calculus instantly in their head. The result is often a confident hallucination.
            </p>
        </div>
        
        <div className={`${cardBg} p-8 rounded-2xl border ${isLightMode ? 'border-blue-100 hover:border-blue-200 shadow-blue-100/50' : 'border-blue-500/20 hover:border-blue-500/40'} transition-all group hover:shadow-lg`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isLightMode ? 'bg-blue-50' : 'bg-blue-500/10'}`}>
                <BrainCircuit className="text-blue-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${cardTitle}`}>Thinking Mode</h3>
            <p className={cardText}>
                "Thinking Mode" forces the AI to use a virtual scratchpad. By writing down intermediate steps, it validates its own logic before committing to a final answer, drastically reducing errors in math and reasoning.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;