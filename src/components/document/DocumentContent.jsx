import DocumentPageBreak from './DocumentPageBreak'

export const DocumentContent = ({
  blocks = [],
  className = '',
}) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className={`doc-content-container w-full ${className}`}>
      {blocks.map((block) => renderBlock(block))}
    </div>
  )
}

function renderBlock(block) {
  const { id, type } = block

  switch (type) {
    case 'hero':
      return (
        <div key={id} data-block-id={id} className="mb-6 pt-2">
          {block.title && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
              {block.title}
            </h1>
          )}
          {block.subtitle && (
            <p className="text-xs font-semibold text-[#FB6C00] uppercase tracking-wider mb-3">
              {block.subtitle}
            </p>
          )}
          {block.lead && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
              {block.lead}
            </p>
          )}
        </div>
      )

    case 'heading': {
      const level = block.level || 1
      const Tag = `h${Math.min(Math.max(1, level), 6)}`
      const headingClass =
        level === 1
          ? 'doc-heading-1'
          : level === 2
          ? 'doc-heading-2'
          : 'doc-heading-3'

      return (
        <Tag key={id} data-block-id={id} className={headingClass}>
          {block.text}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p key={id} data-block-id={id} className="doc-paragraph">
          {block.text}
        </p>
      )

    case 'bulletList':
      return (
        <ul
          key={id}
          data-block-id={id}
          className="list-disc pl-5 mb-4 space-y-1.5 text-xs text-gray-600 leading-relaxed"
        >
          {(block.items || []).map((item, idx) => (
            <li key={idx} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      )

    case 'orderedList':
      return (
        <ol
          key={id}
          data-block-id={id}
          className="list-decimal pl-5 mb-4 space-y-1.5 text-xs text-gray-600 leading-relaxed"
        >
          {(block.items || []).map((item, idx) => (
            <li key={idx} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      )

    case 'table':
      return (
        <div key={id} data-block-id={id} className="doc-table-container">
          {block.caption && (
            <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-between">
              <span>{block.caption}</span>
              {block.isContinued && (
                <span className="text-[10px] text-[#FB6C00] font-medium bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  (Continued from previous page)
                </span>
              )}
            </div>
          )}

          <table className="doc-table">
            {block.headers && block.headers.length > 0 && (
              <thead>
                <tr>
                  {block.headers.map((header, hIdx) => (
                    <th key={hIdx}>{header}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(block.rows || []).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50/50">
                  {Array.isArray(row)
                    ? row.map((cell, cIdx) => (
                        <td key={cIdx}>{cell}</td>
                      ))
                    : Object.values(row).map((val, cIdx) => (
                        <td key={cIdx}>{val}</td>
                      ))}
                </tr>
              ))}

              {block.summaryRow && (
                <tr className="summary-row">
                  {block.summaryRow.map((cell, sIdx) => (
                    <td key={sIdx}>{cell}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )

    case 'image':
      return (
        <div key={id} data-block-id={id} className="my-4 flex flex-col items-center">
          <img
            src={block.src}
            alt={block.alt || 'Document Illustration'}
            style={{
              maxWidth: block.width ? `${block.width}px` : '100%',
              maxHeight: block.height ? `${block.height}px` : '280px',
            }}
            className="rounded-lg object-contain border border-gray-100"
          />
          {block.title && (
            <span className="text-[10px] text-gray-400 mt-1 italic">
              {block.title}
            </span>
          )}
        </div>
      )

    case 'blockquote':
      return (
        <blockquote
          key={id}
          data-block-id={id}
          className="my-3 pl-3.5 border-l-2 border-[#FB6C00] text-xs text-gray-600 italic bg-orange-50/20 py-2 pr-3 rounded-r-md"
        >
          {block.text}
        </blockquote>
      )

    case 'divider':
      return (
        <div key={id} data-block-id={id} className="w-full my-4">
          <hr className="border-t border-gray-200" />
        </div>
      )

    case 'pageBreak':
      return (
        <DocumentPageBreak
          key={id}
          data-block-id={id}
          label={block.label || 'Page Break'}
        />
      )

    case 'signatures':
      return (
        <div
          key={id}
          data-block-id={id}
          className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs select-none"
        >
          {block.partyA && (
            <div>
              <p className="font-semibold text-gray-900 mb-8">{block.partyA.title}</p>
              <div className="w-36 h-px bg-gray-400 mb-1.5" />
              <p className="font-bold text-gray-800">{block.partyA.name}</p>
              <p className="text-[11px] text-gray-500">{block.partyA.role}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Date: {block.partyA.date}</p>
            </div>
          )}

          {block.partyB && (
            <div>
              <p className="font-semibold text-gray-900 mb-8">{block.partyB.title}</p>
              <div className="w-36 h-px bg-gray-400 mb-1.5" />
              <p className="font-bold text-gray-800">{block.partyB.name}</p>
              <p className="text-[11px] text-gray-500">{block.partyB.role}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Date: {block.partyB.date}</p>
            </div>
          )}
        </div>
      )

    case 'spacer':
      return (
        <div
          key={id}
          data-block-id={id}
          style={{ height: `${block.height || 16}px` }}
        />
      )

    case 'html':
      return (
        <div
          key={id}
          data-block-id={id}
          className="prose prose-sm max-w-none text-xs text-gray-700 my-2"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )

    default:
      return (
        <div key={id} data-block-id={id} className="my-2 text-xs text-gray-500">
          {block.text || JSON.stringify(block)}
        </div>
      )
  }
}

export default DocumentContent
