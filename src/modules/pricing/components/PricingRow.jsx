import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Copy, Trash2 } from 'lucide-react'
import DiscountInput from './DiscountInput'
import TaxInput from './TaxInput'
import { formatCurrency } from '../utils/currencyHelpers'
import { calculateRowTotal } from '../utils/pricingCalculations'

const UNIT_OPTIONS = [
  'Milestone',
  'Hours',
  'Days',
  'Month',
  'Package',
  'Unit',
  'License',
  'Service',
]

export const PricingRow = ({
  item,
  index = 0,
  currency = 'INR',
  currencySymbol = '₹',
  taxMode = 'per_item',
  onUpdate = () => {},
  onRemove = () => {},
  onDuplicate = () => {},
  disabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
  }

  const calc = calculateRowTotal(item)

  const handleFieldChange = (field, value) => {
    onUpdate(item.id, { [field]: value })
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-gray-100 hover:bg-orange-50/20 transition-colors ${
        isDragging ? 'bg-orange-50/40 shadow-md ring-1 ring-[#FB6C00]/30' : ''
      }`}
    >
      {/* 1. Drag Handle & Index */}
      <td className="py-3 px-2 text-center w-12 select-none">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={disabled}
            aria-label="Reorder Item"
            className="p-1 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder deliverable"
          >
            <GripVertical className="w-4 h-4 stroke-[2]" />
          </button>
          <span className="text-xs font-semibold text-gray-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* 2. Description / Title */}
      <td className="py-3 px-3 min-w-[240px]">
        <input
          type="text"
          value={item.description || ''}
          placeholder="Deliverable title or scope summary..."
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={disabled}
          className="w-full text-xs font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-transparent focus:border-[#FB6C00] focus:ring-0 px-1 py-1 hover:border-gray-200 transition-colors"
        />
      </td>

      {/* 3. Quantity */}
      <td className="py-3 px-2 w-20">
        <input
          type="number"
          min="1"
          step="1"
          value={item.quantity === 0 ? '' : item.quantity}
          onChange={(e) =>
            handleFieldChange(
              'quantity',
              Math.max(1, parseFloat(e.target.value) || 1)
            )
          }
          disabled={disabled}
          className="w-full h-8 text-center text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
        />
      </td>

      {/* 4. Unit */}
      <td className="py-3 px-2 w-28">
        <select
          value={item.unit || 'Milestone'}
          onChange={(e) => handleFieldChange('unit', e.target.value)}
          disabled={disabled}
          className="w-full h-8 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] px-1.5 cursor-pointer"
        >
          {UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </td>

      {/* 5. Unit Price */}
      <td className="py-3 px-2 w-32">
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-xs font-bold text-gray-400 pointer-events-none select-none">
            {currencySymbol}
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={item.unitPrice === 0 ? '' : item.unitPrice}
            placeholder="0"
            onChange={(e) =>
              handleFieldChange('unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
            }
            disabled={disabled}
            className="w-full h-8 pl-7 pr-2 text-right text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
        </div>
      </td>

      {/* 6. Discount (Percentage or Fixed) */}
      <td className="py-3 px-2 w-32">
        <DiscountInput
          type={item.discountType || 'percentage'}
          value={item.discountValue !== undefined ? item.discountValue : (item.discount || 0)}
          currencySymbol={currencySymbol}
          compact
          disabled={disabled}
          onChangeType={(type) => handleFieldChange('discountType', type)}
          onChangeValue={(val) => handleFieldChange('discountValue', val)}
        />
      </td>

      {/* 7. Tax (Per Item mode only, otherwise hidden/muted) */}
      {taxMode === 'per_item' ? (
        <td className="py-3 px-2 w-32">
          <TaxInput
            value={item.taxRate !== undefined ? item.taxRate : (item.tax !== undefined ? item.tax : 18)}
            onChange={(val) => handleFieldChange('taxRate', val)}
            compact
            disabled={disabled}
          />
        </td>
      ) : (
        <td className="py-3 px-2 w-24 text-center">
          <span className="text-xs text-gray-400 italic">Overall</span>
        </td>
      )}

      {/* 8. Total */}
      <td className="py-3 px-3 w-32 text-right">
        <span className="text-xs font-bold text-gray-900">
          {formatCurrency(calc.total, currency)}
        </span>
        {calc.discountAmount > 0 && (
          <div className="text-[10px] text-emerald-600 font-medium">
            -{formatCurrency(calc.discountAmount, currency)}
          </div>
        )}
      </td>

      {/* 9. Action Buttons */}
      <td className="py-3 px-2 w-20 text-center">
        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onDuplicate(item.id)}
            disabled={disabled}
            title="Duplicate line item"
            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            title="Delete deliverable"
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PricingRow
