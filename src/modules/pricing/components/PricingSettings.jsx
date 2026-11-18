import { useState } from 'react'
import { Plus, Trash2, Calendar, Receipt, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import TaxInput from './TaxInput'
import { DEFAULT_MILESTONE_PRESETS } from '../services/pricingService'
import { formatCurrency } from '../utils/currencyHelpers'

export const PricingSettings = ({
  currency = 'INR',
  currencySymbol = '₹',
  taxMode = 'per_item',
  overallTaxRate = 18,
  onOverallTaxRateChange = () => {},
  globalDiscountType = 'percentage',
  globalDiscountValue = 0,
  onGlobalDiscountChange = () => {},
  additionalCharges = [],
  onAddAdditionalCharge = () => {},
  onUpdateAdditionalCharge = () => {},
  onRemoveAdditionalCharge = () => {},
  paymentMilestones = [],
  onAddPaymentMilestone = () => {},
  onUpdatePaymentMilestone = () => {},
  onRemovePaymentMilestone = () => {},
  onApplyMilestonePreset = () => {},
  grandTotal = 0,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newChargeLabel, setNewChargeLabel] = useState('')
  const [newChargeAmount, setNewChargeAmount] = useState('')

  const handleAddCharge = (e) => {
    e.preventDefault()
    if (!newChargeLabel.trim()) return
    onAddAdditionalCharge({
      label: newChargeLabel.trim(),
      amount: parseFloat(newChargeAmount) || 0,
    })
    setNewChargeLabel('')
    setNewChargeAmount('')
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all ${className}`}>
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF]">
            <Receipt className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Commercial Adjustments, Additional Charges & Payment Milestones
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure tax rates, additional charges, and billing milestone schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#0055FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {isOpen ? 'Collapse Settings' : 'Expand Settings'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-6 space-y-6 border-t border-gray-100">
          <div>
            {/* Overall Tax (when taxMode === 'overall') */}
            <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0055FF]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Overall Statutory Tax Rate
                  </span>
                </div>
                <span className="text-[11px] text-gray-500">
                  {taxMode === 'overall' ? 'Active' : 'Per-item tax is currently active'}
                </span>
              </div>
              {taxMode === 'overall' ? (
                <TaxInput
                  value={overallTaxRate}
                  onChange={onOverallTaxRateChange}
                  disabled={disabled}
                />
              ) : (
                <div className="text-xs text-gray-500 italic py-1.5">
                  Tax is currently configured individually for each item line in the table above. Switch to &apos;Overall&apos; in the toolbar to apply a uniform tax rate.
                </div>
              )}
            </div>
          </div>

          {/* 3. Additional Charges */}
          <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Additional Fees & Charges
                </h5>
                <p className="text-xs text-gray-500">
                  Add non-itemized charges such as setup fees, express onboarding, or shipping.
                </p>
              </div>
            </div>

            {/* Add Charge Inline Form */}
            <form onSubmit={handleAddCharge} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Charge description (e.g. Express Onboarding Fee)"
                value={newChargeLabel}
                onChange={(e) => setNewChargeLabel(e.target.value)}
                disabled={disabled}
                className="flex-1 h-9 px-3 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
              />
              <div className="relative w-full sm:w-40">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="Amount"
                  value={newChargeAmount}
                  onChange={(e) => setNewChargeAmount(e.target.value)}
                  disabled={disabled}
                  className="w-full h-9 pl-7 pr-3 text-xs font-semibold text-right text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
                />
              </div>
              <button
                type="submit"
                disabled={disabled || !newChargeLabel.trim()}
                className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Charge</span>
              </button>
            </form>

            {/* Existing Additional Charges List */}
            {additionalCharges.length > 0 && (
              <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white overflow-hidden">
                {additionalCharges.map((chg) => (
                  <div key={chg.id} className="p-3 flex items-center justify-between text-xs">
                    <input
                      type="text"
                      value={chg.label}
                      onChange={(e) =>
                        onUpdateAdditionalCharge(chg.id, { label: e.target.value })
                      }
                      disabled={disabled}
                      className="font-medium text-gray-800 bg-transparent border-0 focus:ring-0 p-0 hover:underline"
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <span>{currencySymbol}</span>
                        <input
                          type="number"
                          min="0"
                          value={chg.amount}
                          onChange={(e) =>
                            onUpdateAdditionalCharge(chg.id, {
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          disabled={disabled}
                          className="w-24 text-right border border-gray-200 rounded px-1.5 py-0.5"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveAdditionalCharge(chg.id)}
                        disabled={disabled}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Payment Milestones Schedule */}
          <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#0055FF]" />
                  Billing Milestones & Advance Schedule
                </h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Split payments across phases or require an upfront advance deposit.
                </p>
              </div>

              {/* Preset Milestones Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Presets:</span>
                <select
                  onChange={(e) => {
                    const preset = DEFAULT_MILESTONE_PRESETS.find(
                      (p) => p.name === e.target.value
                    )
                    if (preset) onApplyMilestonePreset(preset.milestones)
                  }}
                  defaultValue=""
                  disabled={disabled}
                  aria-label="Milestone presets"
                  className="h-8 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF] cursor-pointer"
                >
                  <option value="" disabled>
                    Choose preset...
                  </option>
                  {DEFAULT_MILESTONE_PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-2">
              {paymentMilestones.map((ms, idx) => {
                const calculatedValue =
                  ms.type === 'percentage'
                    ? (grandTotal * (ms.value || 0)) / 100
                    : ms.value || 0

                return (
                  <div
                    key={ms.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0055FF] font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={ms.name}
                        onChange={(e) =>
                          onUpdatePaymentMilestone(ms.id, { name: e.target.value })
                        }
                        disabled={disabled}
                        placeholder="Milestone title..."
                        className="w-full font-semibold text-gray-800 bg-transparent border-0 focus:ring-0 p-0"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Percent vs Fixed Toggle */}
                      <div className="flex items-center bg-gray-100 rounded p-0.5 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdatePaymentMilestone(ms.id, { type: 'percentage' })
                          }
                          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                            ms.type === 'percentage'
                              ? 'bg-white text-[#0055FF] shadow-2xs'
                              : 'text-gray-500'
                          }`}
                        >
                          %
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdatePaymentMilestone(ms.id, { type: 'fixed' })
                          }
                          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                            ms.type === 'fixed'
                              ? 'bg-white text-[#0055FF] shadow-2xs'
                              : 'text-gray-500'
                          }`}
                        >
                          {currencySymbol}
                        </button>
                      </div>

                      {/* Value Input */}
                      <input
                        type="number"
                        min="0"
                        step={ms.type === 'percentage' ? 5 : 1000}
                        value={ms.value}
                        onChange={(e) =>
                          onUpdatePaymentMilestone(ms.id, {
                            value: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={disabled}
                        className="w-20 text-right h-7 px-2 font-semibold text-gray-900 border border-gray-200 rounded"
                      />

                      {/* Calculated Amount */}
                      <span className="w-28 text-right font-bold text-gray-800">
                        {formatCurrency(calculatedValue, currency)}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemovePaymentMilestone(ms.id)}
                        disabled={disabled}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() =>
                  onAddPaymentMilestone({
                    name: `Phase ${paymentMilestones.length + 1}`,
                    type: 'percentage',
                    value: 20,
                  })
                }
                disabled={disabled}
                className="w-full py-2 text-xs font-semibold text-[#0055FF] bg-blue-50/50 hover:bg-blue-50 border border-dashed border-[#0055FF]/40 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Payment Milestone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingSettings
