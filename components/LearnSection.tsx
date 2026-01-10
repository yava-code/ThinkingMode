import React, { useState, useEffect } from 'react';
import { Brain, Cpu, AlertTriangle, Zap, Scale, RefreshCw, Coins, BookOpen, GraduationCap, Sigma } from 'lucide-react';
import SelfAttention from './SelfAttention';
import TreeVisualization from './TreeVisualization';
import { audioManager } from '../utils/audioSystem';

interface LearnSectionProps {
  isLightMode: boolean;
}

// Simple Tooltip helper component
const Tooltip: React.FC<{ text: string; tooltip: string }> = ({ text, tooltip }) => (
  <span className="tooltip-container font-semibold text-blue-500 border-b border-dashed border-blue-400 cursor-help relative inline-block z-0 hover:z-50">
    {text}
    <span className="tooltip-text z-50">{tooltip}</span>
  </span>
);

const LearnSection: React.FC<LearnSectionProps> = ({ isLightMode }) => {
  const [isTechnical, setIsTechnical] = useState(false);
  
  const cardBg = isLightMode ? 'bg-white shadow-sm' : 'bg-slate-800/50 border border-slate-700';
  const textColor = isLightMode ? 'text-slate-800' : 'text-slate-200';
  const subTextColor = isLightMode ? 'text-slate-500' : 'text-gray-400';
  const sectionBg = isLightMode ? 'bg-[#F8F9FA]' : 'bg-slate-900/80';
  const borderColor = isLightMode ? 'border-slate-100' : 'border-slate-800';

  const toggleTechnical = () => {
    setIsTechnical(!isTechnical);
    audioManager.playClick();
  };

  return (
    <div id="scientific-dive" className={`w-full py-24 px-4 ${sectionBg} backdrop-blur-sm border-t ${borderColor} transition-colors duration-500 ${isLightMode ? 'light-mode' : ''}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Academic Mode Toggle */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-4 bg-slate-900/10 dark:bg-slate-100/10 p-1 rounded-xl mb-6 border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
             <div className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-transform duration-300 ease-in-out ${isTechnical ? 'translate-x-full' : 'translate-x-0'} ${isLightMode ? 'bg-white shadow-sm' : 'bg-slate-700'}`}></div>
             
             <button 
                onClick={() => !isTechnical ? null : toggleTechnical()}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${!isTechnical ? (isLightMode ? 'text-slate-900' : 'text-white') : (isLightMode ? 'text-slate-500' : 'text-slate-400')}`}
             >
                <BookOpen size={16} /> Simple
             </button>
             <button 
                onClick={() => isTechnical ? null : toggleTechnical()}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${isTechnical ? (isLightMode ? 'text-slate-900' : 'text-white') : (isLightMode ? 'text-slate-500' : 'text-slate-400')}`}
             >
                <GraduationCap size={16} /> Academic
             </button>
          </div>

          <h2 className={`text-4xl font-bold mb-6 ${textColor} text-center`}>The Science of Reasoning</h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${subTextColor} text-center`}>
            {isTechnical ? (
                <span>
                    Transformer-based architectures are inherently <Tooltip text="stochastic" tooltip="Randomly determined; having a random probability distribution." />. 
                    Without scaffolded inference time compute, they rely on zero-shot greedy decoding or nucleus sampling. 
                    Thinking Mode integrates <span className="text-blue-500 font-bold">Process Reward Models (PRMs)</span> to evaluate intermediate logic states.
                </span>
            ) : (
                <span>
                    Large Language Models (LLMs) are natively <Tooltip text="probabilistic engines" tooltip="Systems that predict the next word based on statistical likelihood rather than understanding facts." />. Without intervention, they behave like an impulsive human brain. 
                    Thinking Mode architecture bridges the gap between intuition and rigorous logic.
                </span>
            )}
          </p>
        </div>

        {/* System 1 vs System 2 (Dynamic Content) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-start">
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold flex items-center gap-3 ${textColor}`}>
              <Zap size={28} className="text-red-500" />
              {isTechnical ? 'Zero-Shot Inference' : 'System 1: The Impulse'}
            </h3>
            <p className={`leading-relaxed ${subTextColor}`}>
              {isTechnical ? (
                  <span>
                    Standard inference relies on <span className="font-mono text-red-500">argmax P(next_token | context)</span>. 
                    The model attempts to map input vectors directly to the final output vector in a single forward pass, 
                    bypassing intermediate computational steps required for multi-hop reasoning.
                  </span>
              ) : (
                  <span>
                    Psychologist Daniel Kahneman described <Tooltip text="System 1" tooltip="Fast, automatic, frequent, emotional, stereotypic, and unconscious." /> as fast, automatic, and emotional. 
                    Standard LLMs operate here. When you ask <span className="font-mono text-sm bg-blue-500/10 px-1 rounded">2 + 2</span>, 
                    it doesn't calculate; it retrieves the most likely next token.
                  </span>
              )}
            </p>
            <div className={`p-6 rounded-xl border ${isLightMode ? 'bg-red-50 border-red-100' : 'bg-red-950/20 border-red-900/30'}`}>
              <h4 className="font-bold text-red-500 mb-2">Failure Mode: Tokenization Artifacts</h4>
              {isTechnical ? (
                 <div className="font-mono text-xs space-y-3">
                    <p className={subTextColor}>Input: "Strawberry"</p>
                    <div className="p-2 bg-black/20 rounded border border-red-500/30">
                        IDs: [1204, 8831] <br/>
                        Tokens: ["Straw", "berry"]
                    </div>
                    <div className="flex items-center gap-2 text-red-400">
                        <Sigma size={14} />
                        <span>Visual attention heads fail to decompose sub-token characters without explicit scratching.</span>
                    </div>
                 </div>
              ) : (
                 <div className="font-mono text-xs space-y-2">
                    <p className={subTextColor}>Input: "Strawberry"</p>
                    <div className="flex items-center gap-2">
                      <span className="opacity-50">View:</span>
                      <span className="bg-slate-500/20 px-1 rounded">[Straw]</span>
                      <span className="bg-slate-500/20 px-1 rounded">[berry]</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle size={12} />
                      <span>The model sees whole chunks, not letters. It guesses count.</span>
                    </div>
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className={`text-2xl font-bold flex items-center gap-3 ${textColor}`}>
              <Brain size={28} className="text-blue-500" />
              {isTechnical ? 'Chain-of-Thought (CoT)' : 'System 2: The Logic'}
            </h3>
            <p className={`leading-relaxed ${subTextColor}`}>
              {isTechnical ? (
                  <span>
                    Thinking Mode injects a <span className="font-mono text-blue-500">hidden_state</span> sequence. 
                    By generating tokens that represent reasoning steps, the Transformer's Attention mechanism <span className="font-mono">Attention(Q, K, V)</span> can attend to these prior logic steps, effectively increasing the effective depth of computation before the final answer.
                  </span>
              ) : (
                  <span>
                    <Tooltip text="System 2" tooltip="Slow, effortful, infrequent, logical, calculating, and conscious." /> is slow, deliberative, and logical. 
                    Thinking Mode forces the LLM to allocate a "thinking budget" of tokens. It must generate steps before the final answer, catching its own errors.
                  </span>
              )}
            </p>
            
            {isTechnical && (
                <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="font-mono text-xs text-center opacity-80 mb-1">Transformer Attention Mechanism</div>
                    <div className={`text-center font-serif text-lg ${isLightMode ? 'text-slate-800' : 'text-blue-300'}`}>
                        Attention(Q, K, V) = softmax( <span className="inline-block relative top-1"><span className="border-b border-current">QK<sup>T</sup></span><span className="block text-xs">√d<sub>k</sub></span></span> ) V
                    </div>
                </div>
            )}

            {!isTechnical && (
                <div className={`p-6 rounded-xl border ${isLightMode ? 'bg-blue-50 border-blue-100' : 'bg-blue-950/20 border-blue-900/30'}`}>
                    <h4 className="font-bold text-blue-500 mb-2">Success Mode: Reasoning</h4>
                    <div className="font-mono text-xs space-y-2 relative">
                        <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-blue-500/20"></div>
                        <div className="pl-4">1. Break word into letters: S-t-r-a-w-b-e-r-r-y</div>
                        <div className="pl-4">2. Iterate and count 'r's...</div>
                        <div className="pl-4">3. Found at index 2, 7, 8</div>
                        <div className="pl-4 font-bold text-blue-500">{`->`} Count is 3.</div>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Cost Calculator Widget */}
        <div className="mb-24">
            <TokenCostWidget isLightMode={isLightMode} isTechnical={isTechnical} />
        </div>

        {/* Tree of Thoughts Visualization */}
        <div className="mb-24">
            <h3 className={`text-2xl font-bold mb-8 text-center ${textColor}`}>
                {isTechnical ? 'Tree-Search Decoding Strategies' : 'The "Tree of Thoughts" Framework'}
            </h3>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl p-8 border ${cardBg}`}>
                <div className="space-y-6">
                    <p className={`leading-relaxed ${subTextColor}`}>
                        {isTechnical ? (
                            <span>
                                Unlike standard autoregressive decoding (greedy/beam search) which looks 1 step ahead, <span className="font-bold text-blue-500">Tree of Thoughts (ToT)</span> utilizes a search algorithm (BFS/DFS) over the space of reasoning steps. A <span className="font-mono text-blue-400">Verifier</span> model scores each node.
                            </span>
                        ) : (
                            <span>
                                Advanced reasoning isn't just a straight line. The <span className="font-bold text-blue-500">Tree of Thoughts</span> framework allows the model to explore multiple possible futures simultaneously, like a chess player calculating moves ahead.
                            </span>
                        )}
                    </p>
                    <div className="flex gap-4">
                        <div className={`flex-1 p-4 rounded-lg border ${isLightMode ? 'bg-green-50 border-green-100' : 'bg-green-900/10 border-green-900'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold text-green-600">
                                <RefreshCw size={18} /> {isTechnical ? 'Backtracking' : 'Retrying'}
                            </div>
                            <p className="text-xs opacity-70">
                                {isTechnical ? 'Pruning low-probability branches during the search.' : 'If one path makes no sense, it goes back and tries another way.'}
                            </p>
                        </div>
                        <div className={`flex-1 p-4 rounded-lg border ${isLightMode ? 'bg-orange-50 border-orange-100' : 'bg-orange-900/10 border-orange-900'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold text-orange-600">
                                <Scale size={18} /> {isTechnical ? 'Heuristic Value' : 'Checking'}
                            </div>
                            <p className="text-xs opacity-70">
                                {isTechnical ? 'P(correct | current_state) estimated by the model.' : 'Each thought is double-checked before moving forward.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Tree Visualization */}
                <TreeVisualization isLightMode={isLightMode} />
            </div>
        </div>

        {/* Inference Cost & Attention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
             <div className="order-2 md:order-1">
                 {/* Replaced CSS Grid Heatmap with SelfAttention */}
                 <SelfAttention isLightMode={isLightMode} />
             </div>

             <div className="order-1 md:order-2 space-y-6">
                 <h3 className={`text-2xl font-bold flex items-center gap-3 ${textColor}`}>
                    <Cpu size={28} className="text-purple-500" />
                    {isTechnical ? 'Computational Complexity' : 'The Cost of Thinking'}
                 </h3>
                 <p className={`leading-relaxed ${subTextColor}`}>
                    {isTechnical ? (
                        <span>
                            Transformer complexity is <span className="font-mono text-purple-500">O(N²)</span> with respect to sequence length N. 
                            Thinking Mode significantly increases N by prepending a chain of thought. 
                            While this linear increase in tokens leads to a quadratic increase in attention calculations, it is necessary for resolving dependencies in complex logic.
                        </span>
                    ) : (
                        <span>
                            Think of a direct answer like a <span className="font-semibold text-purple-500">Sprint</span>: fast, cheap, but you can trip easily. 
                            Thinking Mode is like a <span className="font-semibold text-purple-500">Math Exam</span> where you must show your work. 
                            It takes longer and costs more "brain power" (compute), but it's the only way to ensure reliability.
                        </span>
                    )}
                 </p>
             </div>
        </div>

        {/* References */}
        <div className="text-center">
          <h3 className={`text-lg font-bold mb-6 ${textColor}`}>Further Reading</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://arxiv.org/abs/2201.11903" target="_blank" rel="noopener noreferrer" 
               className={`px-4 py-2 rounded-lg text-sm transition-colors border ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
               📄 <Tooltip text="Zero-shot CoT" tooltip="Asking the model to 'Think step by step' without providing examples." /> (Wei et al., 2022)
            </a>
            <a href="https://arxiv.org/abs/2305.10601" target="_blank" rel="noopener noreferrer" 
               className={`px-4 py-2 rounded-lg text-sm transition-colors border ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
               📄 Tree of Thoughts (Yao et al., 2023)
            </a>
            <a href="https://ai.google/discover/geometric-reasoning/" target="_blank" rel="noopener noreferrer" 
               className={`px-4 py-2 rounded-lg text-sm transition-colors border ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
               📄 AlphaGeometry & Deep Reasoning
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-Component: Token Cost Widget ---
const TokenCostWidget: React.FC<{isLightMode: boolean}> = ({ isLightMode }) => {
    const [standardCount, setStandardCount] = useState(0);
    const [reasoningCount, setReasoningCount] = useState(0);
    
    // Animation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setStandardCount(prev => prev < 50 ? prev + 1 : 50);
            setReasoningCount(prev => prev < 2050 ? prev + 25 : 2050);
        }, 20);
        
        // Reset every few seconds for visual effect
        const reset = setInterval(() => {
            setStandardCount(0);
            setReasoningCount(0);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(reset);
        };
    }, []);

    // Pricing Assumptions (Approximation)
    const pricePerMillion = 10.00; 
    const standardCost = (standardCount / 1000000) * pricePerMillion;
    const reasoningCost = (reasoningCount / 1000000) * pricePerMillion;

    return (
        <div className={`rounded-2xl p-8 border ${isLightMode ? 'bg-white shadow-lg border-slate-200' : 'bg-slate-800/80 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-6">
                <Coins className={isLightMode ? "text-slate-700" : "text-yellow-400"} />
                <h3 className={`text-xl font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                    The Economics of Reasoning
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Standard */}
                <div className={`p-6 rounded-xl border relative overflow-hidden ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Zap size={64} /></div>
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">Standard Query</h4>
                    <div className="text-3xl font-mono font-bold mb-1">{standardCount} <span className="text-sm font-sans opacity-50">tokens</span></div>
                    <div className="text-xs font-mono opacity-50 mb-4">Input + Output</div>
                    
                    <div className="flex items-center justify-between border-t pt-4 border-slate-500/20">
                        <span className="text-xs">Est. Cost</span>
                        <span className="font-mono font-bold text-green-500">${standardCost.toFixed(6)}</span>
                    </div>
                </div>

                {/* Reasoning */}
                <div className={`p-6 rounded-xl border relative overflow-hidden ${isLightMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-500/30'}`}>
                     <div className="absolute top-0 right-0 p-2 opacity-10 text-blue-500"><Brain size={64} /></div>
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2 text-blue-500">Thinking Query</h4>
                    <div className="text-3xl font-mono font-bold mb-1 text-blue-500">{reasoningCount} <span className="text-sm font-sans opacity-50 text-current">tokens</span></div>
                    <div className="text-xs font-mono opacity-50 mb-4">Input + <span className="font-bold">2000 Hidden</span> + Output</div>
                    
                    <div className="flex items-center justify-between border-t pt-4 border-slate-500/20">
                        <span className="text-xs">Est. Cost</span>
                        <span className="font-mono font-bold text-orange-400">${reasoningCost.toFixed(4)}</span>
                    </div>
                </div>
            </div>
            <p className="text-center mt-6 text-xs opacity-50 italic">
                *Visual approximation. Reasoning involves generating thousands of "hidden" tokens to formulate the strategy, drastically increasing inference cost.
            </p>
        </div>
    );
};

export default LearnSection;