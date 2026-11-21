import React from 'react'
import { Copy } from 'lucide-react'

export function formatInlineText(text = '') {
  if (!text) return ''
  let processed = text.replace(/<br\s*\/?>/gi, '\n')
  const parts = processed.split(/(\*\*.*?\*\*)/g)

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldContent = part.slice(2, -2)
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {boldContent}
        </strong>
      )
    }

    const subParts = part.split(/(\*.*?\*)/g)
    return subParts.map((sub, subIdx) => {
      if (sub.startsWith('*') && sub.endsWith('*') && sub.length >= 2) {
        return (
          <em key={`${idx}-${subIdx}`} className="italic text-slate-700">
            {sub.slice(1, -1)}
          </em>
        )
      }

      // Handle inline newlines from <br/>
      if (sub.includes('\n')) {
        const lineParts = sub.split('\n')
        return lineParts.map((line, lIdx) => (
          <React.Fragment key={`${idx}-${subIdx}-${lIdx}`}>
            {line}
            {lIdx < lineParts.length - 1 && <br />}
          </React.Fragment>
        ))
      }

      return sub
    })
  })
}

export function renderCleanContent(rawText = '', onCopyCode) {
  if (!rawText) return null

  // Split lines to detect blocks reliably
  const lines = rawText.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // 1. Code Blocks (```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim() || 'text'
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      const code = codeLines.join('\n')
      blocks.push({
        type: 'code',
        language,
        code,
      })
      continue
    }

    // 2. Table Block (lines starting with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        // Extract headers from first row
        const headers = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((col) => col.trim())

        // Skip divider row (row index 1 e.g. | :--- | :--- |)
        const dataRows = []
        for (let r = 1; r < tableLines.length; r++) {
          const rowText = tableLines[r]
          // Check if divider row
          if (/^\|(\s*:?-+:?\s*\|)+$/.test(rowText)) {
            continue
          }
          const cells = rowText
            .split('|')
            .slice(1, -1)
            .map((col) => col.trim())
          dataRows.push(cells)
        }

        blocks.push({
          type: 'table',
          headers,
          rows: dataRows,
        })
        continue
      }
    }

    // 3. Horizontal Rule (--- or ***)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'divider' })
      i++
      continue
    }

    // 4. Section Headings (###, ##, #)
    if (trimmed.startsWith('#')) {
      const cleanTitle = trimmed.replace(/^#{1,6}\s*/, '')
      // Check if title has a leading number like "1. Executive Summary"
      const numberMatch = cleanTitle.match(/^(\d+)[\.\)]\s*(.*)$/)

      if (numberMatch) {
        blocks.push({
          type: 'numbered_heading',
          number: numberMatch[1],
          title: numberMatch[2],
        })
      } else {
        blocks.push({
          type: 'heading',
          title: cleanTitle,
        })
      }
      i++
      continue
    }

    // 5. Bullet List Items (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''))
        i++
      }
      blocks.push({
        type: 'bullet_list',
        items,
      })
      continue
    }

    if (/^\d+[\.\)]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^\d+[\.\)]\s+/.test(lines[i].trim())) {
        const itemLine = lines[i].trim()
        const match = itemLine.match(/^(\d+)[\.\)]\s+(.*)$/)
        if (match) {
          items.push({ number: match[1], text: match[2] })
        } else {
          items.push({ number: items.length + 1, text: itemLine })
        }
        i++
      }
      blocks.push({
        type: 'numbered_list',
        items,
      })
      continue
    }

    if (trimmed) {
      blocks.push({
        type: 'paragraph',
        text: trimmed,
      })
    }

    i++
  }

  return (
    <div className="space-y-3.5 text-slate-800 leading-relaxed text-xs">
      {blocks.map((block, idx) => {
        if (block.type === 'numbered_heading') {
          return (
            <div key={idx} className="flex items-center gap-2.5 pt-3 pb-1 border-b border-slate-100">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-[#0055FF] font-bold text-xs shrink-0">
                {block.number}
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {formatInlineText(block.title)}
              </h3>
            </div>
          )
        }

        // Standard Heading
        if (block.type === 'heading') {
          return (
            <h3 key={idx} className="text-sm font-bold text-slate-900 pt-2 pb-0.5 tracking-tight">
              {formatInlineText(block.title)}
            </h3>
          )
        }

        // Bullet List with Clean Points
        if (block.type === 'bullet_list') {
          return (
            <div key={idx} className="my-2 space-y-2">
              {block.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] mt-1.5 shrink-0" />
                  <div className="flex-1 text-slate-700 leading-relaxed text-xs">
                    {formatInlineText(item)}
                  </div>
                </div>
              ))}
            </div>
          )
        }

        // Numbered List with Clean Numbers
        if (block.type === 'numbered_list') {
          return (
            <div key={idx} className="my-2 space-y-2">
              {block.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] font-bold text-[10px] shrink-0 mt-0.5">
                    {item.number}
                  </span>
                  <div className="flex-1 text-slate-700 leading-relaxed text-xs pt-0.5">
                    {formatInlineText(item.text)}
                  </div>
                </div>
              ))}
            </div>
          )
        }

        // Clean Light-Themed Table
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50/90 font-semibold text-slate-700">
                  <tr>
                    {block.headers.map((th, thIdx) => (
                      <th
                        key={thIdx}
                        className="px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 tracking-tight"
                      >
                        {formatInlineText(th)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3.5 py-2.5 text-slate-600 font-normal leading-relaxed align-top"
                        >
                          {formatInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        // Light-Themed Code Block (NO black theme)
        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100/80 border-b border-slate-200 text-slate-600 text-[11px]">
                <span className="uppercase font-semibold tracking-wider font-mono">
                  {block.language}
                </span>
                {onCopyCode && (
                  <button
                    type="button"
                    onClick={() => onCopyCode(block.code)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </button>
                )}
              </div>
              <pre className="p-3.5 overflow-x-auto text-[11px] leading-relaxed text-slate-800 bg-slate-50 font-mono">
                <code>{block.code}</code>
              </pre>
            </div>
          )
        }

        // Divider (replaces ---)
        if (block.type === 'divider') {
          return <hr key={idx} className="my-3.5 border-slate-200" />
        }

        // Paragraph
        return (
          <p key={idx} className="leading-relaxed text-slate-700 text-xs">
            {formatInlineText(block.text)}
          </p>
        )
      })}
    </div>
  )
}
