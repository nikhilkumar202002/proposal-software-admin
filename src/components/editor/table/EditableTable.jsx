import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export const EditableTable = ({
  headers = [],
  rows = [],
  onChange = () => {},
  editable = true,
  className = '',
}) => {
  const [tableData, setTableData] = useState({
    headers: headers.length > 0 ? headers : ['Column 1', 'Column 2', 'Column 3'],
    rows: rows.length > 0 ? rows : [['', '', '']],
  })

  const handleCellChange = (rowIndex, colIndex, val) => {
    const nextRows = tableData.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row
      const nextRow = [...row]
      nextRow[colIndex] = val
      return nextRow
    })

    const nextState = { ...tableData, rows: nextRows }
    setTableData(nextState)
    onChange(nextState)
  }

  const handleAddRow = () => {
    const blankRow = Array.from({ length: tableData.headers.length }, () => '')
    const nextState = { ...tableData, rows: [...tableData.rows, blankRow] }
    setTableData(nextState)
    onChange(nextState)
  }

  const handleDeleteRow = (index) => {
    if (tableData.rows.length <= 1) return
    const nextState = {
      ...tableData,
      rows: tableData.rows.filter((_, i) => i !== index),
    }
    setTableData(nextState)
    onChange(nextState)
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
              {tableData.headers.map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                  {h}
                </th>
              ))}
              {editable && <th className="w-10 px-2 py-2.5 text-right"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50/50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-1 px-2">
                    {editable ? (
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                        className="w-full px-2 py-1.5 rounded border border-transparent hover:border-gray-200 focus:border-[#FB6C00] focus:bg-white text-xs text-gray-800 focus:outline-none transition-colors"
                      />
                    ) : (
                      <span className="text-gray-800">{cell}</span>
                    )}
                  </td>
                ))}
                {editable && (
                  <td className="p-1 pr-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rIdx)}
                      disabled={tableData.rows.length <= 1}
                      className="p-1 rounded text-gray-400 hover:text-red-600 disabled:opacity-20 transition-colors"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editable && (
        <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#FB6C00] hover:bg-orange-50 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>
      )}
    </div>
  )
}

export default EditableTable
