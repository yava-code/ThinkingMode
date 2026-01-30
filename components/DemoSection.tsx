import React, { useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { generateFastResponse, generateThinkingResponse } from '../services/geminiService';
import ThinkingVisualizer from './ThinkingVisualizer';
import { ModelMode, SCENARIOS, Scenario } from '../types';
import { audioManager } from '../utils/audioSystem';

interface DemoSectionProps {
  isLightMode: boolean;
  setGlobalLoading?: (loading: boolean) => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({ isLightMode, setGlobalLoading }) => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [fastResult, setFastResult] = useState<string | null>(null);
  const [thinkResult, setThinkResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    // Trigger audio click
    audioManager.playClick();
    
    setIsLoading(true);
    if (setGlobalLoading) setGlobalLoading(true);
    
    setFastResult(null);
    setThinkResult(null);

    // Basic sanitization: remove any script tags or suspicious HTML
    const sanitizedQuery = customQuery.replace(/<[^>]*>?/gm, '').trim();
    const query = sanitizedQuery || activeScenario.question;
    const isCustom = !!sanitizedQuery;

    try {
      const [fastRes, thinkRes] = await Promise.all([
        generateFastResponse(query),
        generateThinkingResponse(query)
      ]);

      setFastResult(fastRes);
      setThinkResult(thinkRes);
    } catch (error) {
      console.error("Experiment failed, using automatic fallback:", error);

      // Automatic Fallback Logic
      if (isCustom) {
        setFastResult("I apologize, but the Impulse Engine encountered a rate limit or error. For your custom query, I'm unable to provide an automated guess at this time.");
        setThinkResult("System Auto-Response: Reasoning process interrupted. To maintain operation, I have switched to automatic mode. Please try again in a few minutes or check your API configuration.");
      } else {
        // Use the scenario trap to provide a meaningful fallback
        setFastResult(`[AUTOMATIC RESPONSE] Based on typical impulsive patterns: ${activeScenario.trap.split('.')[0]}.`);
        setThinkResult(`[AUTOMATIC REASONING] Analyzing "${activeScenario.title}"... \n1. Identified common logic trap.\n2. Verified constraints.\n3. Conclusion: ${activeScenario.trap}`);
      }
    } finally {
      setIsLoading(false);
      if (setGlobalLoading) setGlobalLoading(false);
    }
  };

  const handleReset = () => {
    audioManager.playClick();
    setFastResult(null);
    setThinkResult(null);
    setIsLoading(false);
    if (setGlobalLoading) setGlobalLoading(false);
  };

  const titleColor = isLightMode ? 'text-slate-900' : 'text-white';
  const textColor = isLightMode ? 'text-slate-600' : 'text-gray-400';
  const panelBg = isLightMode ? 'bg-white shadow-lg border-slate-100' : 'bg-slate-800/50 border-slate-700';

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16" id="demo">
      <div className="mb-12 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleColor}`}>
          The Split-Screen Test
        </h2>
        <p className={`${textColor} max-w-2xl mx-auto`}>
          Witness the difference in real-time. Select a tricky scenario or type your own logic trap.
        </p>
      </div>

      {/* Controls */}
      <div className={`rounded-2xl p-6 border mb-8 backdrop-blur-sm transition-colors duration-300 ${panelBg}`}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <label className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-gray-300'}`}>
              Choose a trap
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    audioManager.playClick();
                    setActiveScenario(scenario);
                    setCustomQuery('');
                    handleReset();
                  }}
                  className={`p-3 rounded-lg text-left text-sm transition-all border hover:shadow-lg hover:shadow-blue-500/10 ${
                    activeScenario.id === scenario.id && !customQuery
                      ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                      : isLightMode
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-white'
                        : 'bg-slate-900/50 border-slate-700 text-gray-400 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold mb-1">{scenario.title}</div>
                  <div className="text-xs opacity-70">{scenario.difficulty} Difficulty</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <label className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-gray-300'}`}>
              Or enter your own
            </label>
            <div className="relative">
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder={activeScenario.question}
                className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-24 resize-none transition-colors ${
                  isLightMode
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white placeholder-gray-600'
                }`}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {customQuery ? 'Custom Query' : 'Using Preset'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRun}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300
              hover:animate-aura
              ${isLoading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'
              }
            `}
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <Play size={20} fill="currentColor" /> Run Experiment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visualization Grid - Updated Height to Auto/Flexible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left: The Mistake */}
        <div className="flex flex-col h-full min-h-[400px]">
          <div className="flex-1 h-full">
            <ThinkingVisualizer 
                mode={ModelMode.FAST}
                isLoading={isLoading}
                result={fastResult}
                isLightMode={isLightMode}
            />
          </div>
          <div className="mt-4 px-4 pb-4">
            <h4 className="font-bold text-red-500 mb-1 flex items-center gap-2">
              <ArrowRight size={16} /> The "Black Box" Danger
            </h4>
            <p className={`text-sm ${textColor}`}>
              Without scratchpad space, the model guesses the next token immediately. This statistical guessing fails at logic, leading to confident hallucinations.
            </p>
          </div>
        </div>

        {/* Right: The Solution */}
        <div className="flex flex-col h-full min-h-[400px]">
          <div className="flex-1 h-full">
            <ThinkingVisualizer 
                mode={ModelMode.THINKING}
                isLoading={isLoading}
                result={thinkResult}
                isLightMode={isLightMode}
            />
          </div>
          <div className="mt-4 px-4 pb-4">
            <h4 className="font-bold text-blue-500 mb-1 flex items-center gap-2">
              <ArrowRight size={16} /> The Chain of Thought
            </h4>
            <p className={`text-sm ${textColor}`}>
              By explicitly writing down intermediate steps, the model catches its own errors. It moves from "Fast Thinking" (System 1) to "Slow Thinking" (System 2).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;