import { motion } from 'framer-motion'

interface PigIconProps {
  size?: number
  animate?: boolean
  className?: string
}

export function PigIcon({ size = 120, animate = true, className = '' }: PigIconProps) {
  const mudBubbles = [
    { cx: 55, cy: 165, r: 4, delay: 0 },
    { cx: 75, cy: 170, r: 3, delay: 0.5 },
    { cx: 120, cy: 168, r: 5, delay: 0.9 },
    { cx: 140, cy: 163, r: 3, delay: 0.3 },
    { cx: 95, cy: 172, r: 2, delay: 1.2 },
  ]

  return (
    <motion.div
      className={className}
      animate={animate ? { rotate: [-3, 3, -3] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, display: 'inline-block' }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mud puddle */}
        <ellipse cx="100" cy="170" rx="85" ry="28" fill="#3d1a08" />
        <ellipse cx="100" cy="168" rx="75" ry="22" fill="#4a2010" />

        {/* Mud bubbles */}
        {mudBubbles.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill="#7c3d20"
            opacity={0.7}
            animate={{ cy: [b.cy, b.cy - 20], opacity: [0.7, 0], r: [b.r, 0] }}
            transition={{ duration: 1.5, delay: b.delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* Pig body */}
        <ellipse cx="100" cy="135" rx="48" ry="42" fill="#fda4af" />

        {/* Mud on body */}
        <ellipse cx="78" cy="145" rx="14" ry="8" fill="#5c2d0f" opacity="0.55" transform="rotate(-15 78 145)" />
        <ellipse cx="122" cy="138" rx="10" ry="6" fill="#5c2d0f" opacity="0.45" transform="rotate(10 122 138)" />
        <ellipse cx="100" cy="155" rx="12" ry="7" fill="#5c2d0f" opacity="0.4" />

        {/* Pig head */}
        <circle cx="100" cy="88" r="42" fill="#fda4af" />

        {/* Left ear */}
        <ellipse cx="65" cy="55" rx="14" ry="18" fill="#fda4af" transform="rotate(-20 65 55)" />
        <ellipse cx="65" cy="55" rx="7" ry="11" fill="#f9a8c9" transform="rotate(-20 65 55)" />

        {/* Right ear */}
        <ellipse cx="135" cy="55" rx="14" ry="18" fill="#fda4af" transform="rotate(20 135 55)" />
        <ellipse cx="135" cy="55" rx="7" ry="11" fill="#f9a8c9" transform="rotate(20 135 55)" />

        {/* Eyes */}
        <circle cx="83" cy="82" r="7" fill="#1c1917" />
        <circle cx="117" cy="82" r="7" fill="#1c1917" />
        <circle cx="85" cy="80" r="2.5" fill="white" />
        <circle cx="119" cy="80" r="2.5" fill="white" />

        {/* Snout */}
        <ellipse cx="100" cy="100" rx="20" ry="13" fill="#fb7185" />
        <circle cx="93" cy="102" r="5" fill="#be123c" opacity="0.6" />
        <circle cx="107" cy="102" r="5" fill="#be123c" opacity="0.6" />

        {/* Mud smear on face */}
        <ellipse cx="72" cy="95" rx="8" ry="5" fill="#5c2d0f" opacity="0.4" transform="rotate(-25 72 95)" />

        {/* Curly tail */}
        <path
          d="M 148 125 Q 168 118 165 132 Q 162 146 150 142"
          stroke="#fb7185"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Dollar sign on body */}
        <text x="96" y="140" fontSize="16" fill="#f59e0b" fontWeight="bold" opacity="0.6" fontFamily="monospace">$</text>
      </svg>
    </motion.div>
  )
}
