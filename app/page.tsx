"use client";

import { motion } from "framer-motion";
import TensorViz from "@/components/TensorViz";
import MathBlock from "@/components/MathBlock";
import DeepDive from "@/components/DeepDive";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto pt-10 pb-32">
      {/* Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-20"
      >
        <div className="text-oxblood font-mono text-sm tracking-widest mb-2">CLASSIFIED // NEURAL_ARCHIVE_V1</div>
        <h1 className="text-5xl md:text-6xl mb-6">Mechanistic<br/>Interpretability</h1>
        <p className="text-xl text-gray-400 font-light border-l-2 border-oxblood pl-6">
          Reverse Engineering the Ghost in the Machine.
        </p>
      </motion.div>

      {/* Abstract */}
      <section id="abstract" className="mb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-2xl mb-8 flex items-center">
            <span className="text-oxblood mr-4">01.</span> Abstract
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <p>
              Neural networks have long been treated as &quot;black boxes&quot; - systems where inputs mapped to outputs through an opaque process of matrix multiplications and non-linearities. Mechanistic Interpretability seeks to break this paradigm.
            </p>
            <p className="mt-4">
              By applying techniques analogous to reverse engineering compiled binaries, we aim to discover the human-interpretable algorithms hidden within the weights. We treat the model not as a stochastic oracle, but as a computable program waiting to be decompiled.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Linear Representation */}
      <section id="linear-representation" className="mb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-2xl mb-8 flex items-center">
            <span className="text-oxblood mr-4">02.</span> Linear Representation Hypothesis
          </h2>
          <div className="text-gray-300 mb-8">
            <p className="mb-4">
                The fundamental unit of meaning in a transformer is NOT the neuron, but a direction in activation space. Features are represented as vectors.
            </p>
            
            <MathBlock math="h = \\sum_{i} x_i v_i" block />

            <p className="mb-8">
                If we visualize the weight matrix of a layer, we can see sparse activations corresponding to specific features.
            </p>

            <div className="flex flex-col items-center p-8 bg-black border border-gray-800">
                <div className="mb-4 font-mono text-xs text-oxblood">FIG 2.1: ACTIVATION_TENSOR_SIMULATION</div>
                <TensorViz rows={12} cols={16} />
                <div className="mt-4 font-mono text-xs text-gray-600">HOVER TO PROBE ACTIVATIONS</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Superposition */}
      <section id="superposition" className="mb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-2xl mb-8 flex items-center">
            <span className="text-oxblood mr-4">03.</span> The Problem of Superposition
          </h2>
          <div className="text-gray-300">
            <p className="mb-4">
              Real-world features are sparse and numerous. Neural networks are dense and limited in dimension. How does a model pack 10,000 features into a 512-dimensional vector?
            </p>
            <p className="mb-4 text-oxblood/80 font-mono">
              &gt;&gt; WARNING: POLYSEMANTIC NEURONS DETECTED
            </p>
            
            <MathBlock math="N_{features} \\gg d_{model}" block />

            <p className="mb-6">
               Models exploit the geometry of high-dimensional space to store features in &quot;almost orthogonal&quot; directions. This phenomenon is known as Superposition.
            </p>

            <DeepDive title="MATHEMATICAL PROOF OF SUPERPOSITION">
                <p className="mb-4">
                    Consider a set of features <MathBlock math="\\{f_i\\}" />. If we allow for a small interference error <MathBlock math="\\epsilon" />, we can pack exponentially many feature vectors into <MathBlock math="\\mathbb{R}^n" /> such that:
                </p>
                <MathBlock math="\\langle v_i, v_j \\rangle \\approx 0 \\quad \\text{for } i \\neq j" block />
                <p>
                    This is related to the Johnson-Lindenstrauss lemma. The cost is that reading a feature <MathBlock math="v_i" /> now includes noise from all other active features <MathBlock math="v_j" />.
                </p>
            </DeepDive>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
