import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

const MESSAGES = [
  'Loading your losses...',
  'Warming up the trough...',
  'Summoning the bagholder spirit...',
  'Calibrating cope levels...',
  'Ready to lose small.',
]

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const duration = 3000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      setProgress(Math.min((step / steps) * 100, 100))
      setMessageIdx(Math.min(Math.floor((step / steps) * MESSAGES.length), MESSAGES.length - 1))

      if (step >= steps) {
        clearInterval(timer)
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 700)
        }, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ background: '#0a0608' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Hero image — full bleed, slow Ken Burns zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <img
              src="/troughtrader.jpg"
              alt="TroughTrader"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            {/* Dark gradient overlay — bottom heavy so loading UI is readable */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(10,6,8,0.15) 0%, rgba(10,6,8,0.25) 50%, rgba(10,6,8,0.92) 80%, rgba(10,6,8,1) 100%)',
              }}
            />
          </motion.div>

          {/* Bottom loading section */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-14 px-8">
            {/* Loading bar */}
            <motion.div
              className="w-80 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, #d4a017, #f5c842)',
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Loading message */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-center text-xs font-mono tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {MESSAGES[messageIdx]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Version */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 1.2 }}
              className="text-xs font-mono"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              v0.1.0 — MVP Build
            </motion.p>
          </div>

          {/* Floating mud particles (subtle ambient effect) */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                left: `${15 + i * 9}%`,
                background: 'rgba(180,120,60,0.4)',
              }}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{ y: '-20vh', opacity: [0, 0.6, 0] }}
              transition={{
                duration: 3 + i * 0.4,
                delay: 0.5 + i * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
