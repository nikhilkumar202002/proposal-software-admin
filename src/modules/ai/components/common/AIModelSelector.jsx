import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Sparkles, Check, Cpu } from 'lucide-react'
import useAIStore from '../../store/aiStore'

export const AIModelSelector = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { selectedModelId, models, setModelId, getSelectedModel } = useAIStore()
  const activeModel = getSelectedModel()

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left select-none ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 text-xs font-bold text-gray-900 transition-all cursor-pointer shadow-2xs"
        title="Select AI Model"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
        <span className="tracking-tight">{activeModel.name}</span>
        {activeModel.badge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-orange-100 text-[#FB6C00]">
            {activeModel.badge}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-72 bg-white border border-gray-200/90 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
            <span>Select AI Model</span>
            <Cpu className="w-3 h-3 text-gray-400" />
          </div>

          <div className="py-1">
            {models.map((model) => {
              const isSelected = model.id === selectedModelId
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    setModelId(model.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-orange-50/70 text-[#FB6C00]' : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#FB6C00]' : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">{model.name}</span>
                      {model.badge && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded font-semibold bg-gray-100 text-gray-600">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                      {model.recommendedFor}
                    </p>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#FB6C00] shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIModelSelector
