import { useLocation, useNavigate } from 'react-router-dom'
import { RiChatAiFill } from 'react-icons/ri'

export const AIButton = ({ className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide floating button when already on the AI chat page
  if (location.pathname === '/ai' || location.pathname === '/chat') {
    return null
  }

  const handleOpenAIChat = () => {
    navigate('/ai')
  }

  return (
    <div
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 select-none no-print ${className}`}
    >
      {/* Floating AI Orb Button matching the user design */}
      <div className="relative group">
        {/* Soft background glow / aura */}
        <div
          className="absolute -inset-2.5 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(244, 63, 94, 0.45) 45%, rgba(99, 102, 241, 0.3) 75%, transparent 100%)',
          }}
        />

        {/* 3D Gradient Sphere Button */}
        <button
          type="button"
          onClick={handleOpenAIChat}
          aria-label="Open ProposalOS AI Chat"
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 focus:outline-none"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 45%),
              radial-gradient(circle at 26% 45%, rgba(244, 63, 94, 0.72) 0%, rgba(217, 70, 239, 0.35) 35%, transparent 60%),
              radial-gradient(circle at 50% 40%, #8b5cf6 0%, #6366f1 35%, #4f46e5 68%, #281577 100%)
            `,
            boxShadow: `
              0 14px 34px -4px rgba(99, 102, 241, 0.55),
              0 8px 18px -2px rgba(244, 63, 94, 0.38),
              inset 0 -6px 12px rgba(20, 8, 80, 0.55),
              inset 0 3px 6px rgba(255, 255, 255, 0.5)
            `,
          }}
          title="Open ProposalOS AI Chat (ChatGPT Interface)"
        >
          {/* Subtle glossy rim reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* RiChatAiFill Icon from react-icons/ri */}
          <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
            <RiChatAiFill className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default AIButton
