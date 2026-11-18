import { Scissors } from 'lucide-react'

export const DocumentPageBreak = ({
  label = 'Page Break',
  showIndicator = true,
  className = '',
}) => {
  return (
    <div
      className={`doc-page-break-container my-3 select-none ${className}`}
      style={{ breakAfter: 'page', pageBreakAfter: 'always' }}
    >
      {showIndicator && (
        <div className="doc-page-break-indicator no-print">
          <Scissors className="w-3.5 h-3.5 stroke-[2] shrink-0" />
          <span className="uppercase tracking-wider text-[10px]">{label}</span>
          <div className="flex-1 border-t border-dashed border-[#0055FF]/40 ml-2" />
        </div>
      )}
    </div>
  )
}

export default DocumentPageBreak
