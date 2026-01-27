"use client";

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathBlockProps {
  math: string;
  block?: boolean;
}

export default function MathBlock({ math, block = false }: MathBlockProps) {
  if (block) {
    return (
      <div className="my-4 p-4 bg-gray-900/50 border-l-2 border-oxblood overflow-x-auto">
        <BlockMath math={math} />
      </div>
    );
  }
  return <InlineMath math={math} />;
}
