'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        {/* Animated Golf Ball / Loading Spinner */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-16 w-16 mb-4 flex items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-500/20"
        >
          <div className="h-2 w-2 bg-white rounded-full absolute top-3 left-4 opacity-70" />
          <div className="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-green-700 dark:text-green-400 tracking-tight"
        >
          Fairway <span className="text-slate-900 dark:text-white">Impact</span>
        </motion.p>
        
        <motion.div
           initial={{ width: 0 }}
           animate={{ width: 120 }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
           className="h-1 bg-green-600 rounded-full mt-2"
        />
      </div>
    </div>
  )
}
