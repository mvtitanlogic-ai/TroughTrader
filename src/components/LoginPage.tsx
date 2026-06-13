import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

const VALID_EMAIL = 'titan@titanlogic.ai'
const VALID_PASSWORD = 'password'

export function LoginPage() {
  const { login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      login({ email, name: 'Titan' })
    } else {
      setError('Invalid credentials. Even your login is a loss.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#080810' }}>
      {/* Left panel — brand image */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-[60%] relative overflow-hidden"
      >
        <img
          src="/troughtrader.jpg"
          alt="TroughTrader"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Right-edge fade into form panel */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(8,8,16,0) 60%, rgba(8,8,16,1) 100%)',
          }}
        />
        {/* Bottom overlay with tagline */}
        <div
          className="absolute bottom-0 left-0 right-0 p-10"
          style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.85) 0%, transparent 100%)' }}
        >
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.7)' }}>
            Not financial advice
          </p>
          <p className="text-white/50 text-sm mt-1">
            Cheap trades. Deep lessons. Zero judgment.
          </p>
        </div>
      </motion.div>

      {/* Right panel — login form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex-1 flex items-center justify-center px-8 py-12 relative"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-yellow-900/8 blur-3xl" />
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Logo — small for mobile, since image is hidden */}
          <div className="mb-10 lg:hidden">
            <img
              src="/troughtrader.jpg"
              alt="TroughTrader"
              className="w-full h-40 object-cover rounded-2xl"
              style={{ objectPosition: 'center 25%' }}
            />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Sign in to enter the trough
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="titan@titanlogic.ai"
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none pr-10 transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(148,163,184,0.5)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-center py-2 px-3 rounded-lg"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full font-semibold py-3 rounded-lg text-sm transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? 'rgba(212,160,23,0.4)' : 'linear-gradient(135deg, #d4a017 0%, #f5c842 100%)',
                color: '#1a0f00',
                boxShadow: '0 4px 24px rgba(212,160,23,0.2)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(26,15,0,0.3)', borderTopColor: '#1a0f00' }} />
                  Entering the trough...
                </span>
              ) : (
                'Enter the Trough'
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-8" style={{ color: 'rgba(148,163,184,0.3)' }}>
            All data is local — your losses stay private
          </p>
          <p className="text-center text-xs mt-1" style={{ color: 'rgba(148,163,184,0.2)' }}>
            TroughTrader v0.1.0
          </p>
        </div>
      </motion.div>
    </div>
  )
}
