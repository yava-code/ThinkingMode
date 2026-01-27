"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Binary } from "lucide-react";
import clsx from "clsx";

interface DeepDiveProps {
  title: string;
  children: React.ReactNode;
}

export default function DeepDive({ title, children }: DeepDiveProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 bg-black my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-900/30 hover:bg-gray-900/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
            <Binary className="w-5 h-5 text-oxblood" />
            <span className="font-mono text-sm uppercase tracking-wider text-gray-300">
                DEEP_DIVE :: {title}
            </span>
        </div>
        <ChevronDown
          className={clsx("w-5 h-5 text-gray-500 transition-transform duration-300", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-800 text-gray-400 leading-relaxed font-sans border-l-4 border-l-oxblood">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
