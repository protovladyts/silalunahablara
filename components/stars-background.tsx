"use client"

import { motion } from "framer-motion"

interface StarsBackgroundProps {
  animated?: boolean
  className?: string
}

export function StarsBackground({ animated = true, className = "" }: StarsBackgroundProps) {
  if (animated) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        {/* Estrellas pequeñas */}
        <motion.div 
          className="absolute w-1 h-1 bg-white rounded-full opacity-60" 
          style={{ top: '15%', left: '20%' }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-violet-300 rounded-full opacity-50" 
          style={{ top: '25%', left: '80%' }}
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40" 
          style={{ top: '35%', left: '10%' }}
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-white rounded-full opacity-70" 
          style={{ top: '45%', left: '90%' }}
          animate={{ opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-violet-200 rounded-full opacity-60" 
          style={{ top: '55%', left: '5%' }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-white rounded-full opacity-50" 
          style={{ top: '65%', left: '85%' }}
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-40" 
          style={{ top: '75%', left: '15%' }}
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-violet-300 rounded-full opacity-60" 
          style={{ top: '85%', left: '75%' }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        />
        
        {/* Estrellas medianas */}
        <motion.div 
          className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-80" 
          style={{ top: '20%', left: '50%' }}
          animate={{ opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div 
          className="absolute w-1.5 h-1.5 bg-violet-200 rounded-full opacity-70" 
          style={{ top: '40%', left: '30%' }}
          animate={{ opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
        />
        <motion.div 
          className="absolute w-1.5 h-1.5 bg-blue-200 rounded-full opacity-60" 
          style={{ top: '60%', left: '70%' }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        />
        <motion.div 
          className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-75" 
          style={{ top: '80%', left: '40%' }}
          animate={{ opacity: [0.75, 0.45, 0.75] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
        />
        
        {/* Estrella brillante especial */}
        <motion.div 
          className="absolute w-2 h-2 bg-yellow-200 rounded-full opacity-90" 
          style={{ top: '30%', left: '60%' }}
          animate={{ opacity: [0.9, 0.6, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="absolute w-2 h-2 bg-yellow-100 rounded-full opacity-80" 
          style={{ top: '70%', left: '25%' }}
          animate={{ opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.6 }}
        />
        
        {/* Estrellas que parpadean más lentamente */}
        <motion.div 
          className="absolute w-1 h-1 bg-white rounded-full opacity-40" 
          style={{ top: '10%', left: '70%' }}
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 3 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-violet-300 rounded-full opacity-30" 
          style={{ top: '50%', left: '95%' }}
          animate={{ opacity: [0.3, 0.05, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 3.5 }}
        />
        <motion.div 
          className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-35" 
          style={{ top: '90%', left: '60%' }}
          animate={{ opacity: [0.35, 0.1, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, delay: 4 }}
        />
      </div>
    )
  }

  // Estrellas estáticas
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Estrellas pequeñas */}
      <div className="absolute w-1 h-1 bg-white rounded-full opacity-60" style={{ top: '15%', left: '20%' }} />
      <div className="absolute w-1 h-1 bg-violet-300 rounded-full opacity-50" style={{ top: '25%', left: '80%' }} />
      <div className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40" style={{ top: '35%', left: '10%' }} />
      <div className="absolute w-1 h-1 bg-white rounded-full opacity-70" style={{ top: '45%', left: '90%' }} />
      <div className="absolute w-1 h-1 bg-violet-200 rounded-full opacity-60" style={{ top: '55%', left: '5%' }} />
      <div className="absolute w-1 h-1 bg-white rounded-full opacity-50" style={{ top: '65%', left: '85%' }} />
      <div className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-40" style={{ top: '75%', left: '15%' }} />
      <div className="absolute w-1 h-1 bg-violet-300 rounded-full opacity-60" style={{ top: '85%', left: '75%' }} />
      
      {/* Estrellas medianas */}
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-80" style={{ top: '20%', left: '50%' }} />
      <div className="absolute w-1.5 h-1.5 bg-violet-200 rounded-full opacity-70" style={{ top: '40%', left: '30%' }} />
      <div className="absolute w-1.5 h-1.5 bg-blue-200 rounded-full opacity-60" style={{ top: '60%', left: '70%' }} />
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-75" style={{ top: '80%', left: '40%' }} />
      
      {/* Estrella brillante especial */}
      <div className="absolute w-2 h-2 bg-yellow-200 rounded-full opacity-90" style={{ top: '30%', left: '60%' }} />
      <div className="absolute w-2 h-2 bg-yellow-100 rounded-full opacity-80" style={{ top: '70%', left: '25%' }} />
    </div>
  )
}
