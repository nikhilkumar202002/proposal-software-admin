import {
  Plus,
  Trash2,
  Copy,
  Receipt,
  Calculator,
  Percent,
  Info,
} from 'lucide-react'
import { Button, Select } from '../../../components/common'
import {
  CURRENCY_CONFIG,
  calculateLineItemTotal,
  calculateProposalTotals,
  formatCurrency,
} from '../utils/proposalHelpers'

const UNIT_OPTIONS = [
  { value: 'Milestone', label: 'Milestone' },
  { value: 'Hours', label: 'Hours' },
  { value: 'Days', label: 'Days' },
  { value: 'Month', label: 'Month' },
  { value: 'Package', label: 'Package' },
  { value: 'Unit', label: 'Unit' },
  { value: 'License', label: 'License' },
  { value: 'Service', label: 'Service' },
]

export const ProposalPricing = ({
  pricing = {},
  onAddItem = () => {},
  onUpdateItem = () => {},
  onRemoveItem = () => {},
  onCurrencyChange = () => {},
  onGlobalDiscountChange = () => {},
  className = '',
}) => {
  const items = Array.isArray(pricing.items) ? pricing.items : []
  const currency = pricing.currency || 'INR'
  const currencyInfo = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR
  const globalDiscount = pricing.globalDiscount || 0

  const totals = calculateProposalTotals(pricing)

  const handleDuplicateRow = (item) => {
    onAddItem({
      ...item,
      description: `${item.description} (Copy)`,
    })
  }

  const currencyOptions = Object.keys(CURRENCY_CONFIG).map((c) => ({
    value: c,
    label: `${CURRENCY_CONFIG[c].symbol} - ${CURRENCY_CONFIG[c].name} (${c})`,
  }))

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Controls: Currency & Overview */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
              <Calculator className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Commercial Schedule & Dynamic Pricing
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Itemize billable deliverables, apply volume discounts, and set applicable taxes.
              </p>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
              Invoicing Currency:
            </span>
            <div className="w-52">
              <Select
                options={currencyOptions}
                value={currency}
                onChange={onCurrencyChange}
                placeholder="Select currency"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Items Table */}
        <div className="pt-5 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/70">
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-3 min-w-[220px]">Deliverable / Description</th>
                <th className="py-3 px-3 w-20 text-center">Qty</th>
                <th className="py-3 px-3 w-28">Unit</th>
                <th className="py-3 px-3 w-32 text-right">Unit Price ({currencyInfo.symbol})</th>
                <th className="py-3 px-3 w-24 text-center">Disc (%)</th>
                <th className="py-3 px-3 w-28 text-center">Tax (%)</th>
                <th className="py-3 px-3 w-32 text-right">Total ({currencyInfo.symbol})</th>
                <th className="py-3 px-3 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 text-xs">
                    No pricing items added yet. Click &quot;Add Deliverable Item&quot; below to start.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const calc = calculateLineItemTotal(item)
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-gray-50/50 transition-colors group text-xs"
                    >
                      {/* Index */}
                      <td className="py-3 px-3 text-center font-semibold text-gray-400">
                        {idx + 1}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) =>
                            onUpdateItem(idx, { description: e.target.value })
                          }
                          placeholder="Item or deliverable description..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 transition-all font-medium"
                        />
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity ?? 1}
                          onChange={(e) =>
                            onUpdateItem(idx, {
                              quantity: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 text-center transition-all"
                        />
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-3">
                        <select
                          value={item.unit || 'Milestone'}
                          onChange={(e) =>
                            onUpdateItem(idx, { unit: e.target.value })
                          }
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 transition-all bg-white"
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice ?? 0}
                          onChange={(e) =>
                            onUpdateItem(idx, {
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 text-right font-medium transition-all"
                        />
                      </td>

                      {/* Discount % */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount ?? 0}
                          onChange={(e) =>
                            onUpdateItem(idx, {
                              discount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 text-center transition-all"
                        />
                      </td>

                      {/* Tax % */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.tax ?? 18}
                          onChange={(e) =>
                            onUpdateItem(idx, {
                              tax: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-gray-900 text-center transition-all"
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        {currencyInfo.symbol} {calc.total.toLocaleString()}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleDuplicateRow(item)}
                            title="Duplicate Row"
                            className="p-1 hover:text-[#FB6C00] text-gray-400 cursor-pointer rounded"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            title="Delete Row"
                            className="p-1 hover:text-red-600 text-gray-400 cursor-pointer rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onAddItem({
                description: 'New Deliverable Milestone',
                quantity: 1,
                unit: 'Milestone',
                unitPrice: 50000,
                discount: 0,
                tax: 18,
              })
            }
            icon={Plus}
            className="text-xs text-[#FB6C00] border-[#FB6C00]/30 hover:bg-orange-50"
          >
            Add Deliverable Item
          </Button>

          <p className="text-xs text-gray-400">
            {items.length} item{items.length === 1 ? '' : 's'} included
          </p>
        </div>
      </div>

      {/* Financial Calculations Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Additional Commercial Terms & Global Discount */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-gray-900 font-semibold text-sm">
            <Percent className="w-4 h-4 text-[#FB6C00]" />
            Commercial Discount & Notes
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              Overall Proposal Discount (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={globalDiscount}
                onChange={(e) => onGlobalDiscountChange(e.target.value)}
                className="w-32 px-3 py-2 rounded-xl border border-gray-200 focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00] outline-none text-sm font-semibold"
                placeholder="0"
              />
              <span className="text-xs text-gray-500">
                Applied on subtotal after line item discounts
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              All tax rates and figures update automatically. Ensure statutory compliance with local GST / VAT regulations for your invoicing entity.
            </span>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-gray-900 font-semibold text-sm">
            <Receipt className="w-4 h-4 text-[#FB6C00]" />
            Financial Breakdown Summary
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Gross Deliverables Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(totals.subtotal, currency)}
              </span>
            </div>

            {totals.lineDiscounts > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Line Item Discounts</span>
                <span className="font-medium">
                  - {formatCurrency(totals.lineDiscounts, currency)}
                </span>
              </div>
            )}

            {totals.globalDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Overall Discount ({globalDiscount}%)</span>
                <span className="font-medium">
                  - {formatCurrency(totals.globalDiscountAmount, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Total Statutory Taxes</span>
              <span className="font-medium text-gray-900">
                + {formatCurrency(totals.totalTax, currency)}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">
                Grand Investment Total
              </span>
              <span className="text-xl font-extrabold text-[#FB6C00]">
                {formatCurrency(totals.grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalPricing
