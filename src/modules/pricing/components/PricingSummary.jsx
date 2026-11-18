import { Receipt, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../utils/currencyHelpers'
import { groupTaxBreakdown } from '../utils/taxHelpers'

export const PricingSummary = ({
  summary = {},
  currency = 'INR',
  className = '',
}) => {
  const {
    subtotal = 0,
    totalLineDiscounts = 0,
    globalDiscountAmount = 0,
    globalDiscountValue = 0,
    globalDiscountType = 'percentage',
    totalDiscount = 0,
    taxableAmount = 0,
    taxMode = 'per_item',
    overallTaxRate = 18,
    totalTax = 0,
    additionalCharges = [],
    additionalChargesTotal = 0,
    grandTotal = 0,
    paymentMilestones = [],
    milestonesTotal = 0,
    remainingBalance = 0,
    items = [],
  } = summary

  const taxGroups = taxMode === 'per_item' ? groupTaxBreakdown(items) : []

  return (
    <div className={`bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Receipt className="w-4 h-4 text-[#0055FF]" />
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Commercial Summary & Investment Total
          </h4>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {currency}
        </span>
      </div>

      {/* Breakdown rows */}
      <div className="p-6 space-y-3.5 text-xs">
        {/* 1. Deliverables Gross Subtotal */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Gross Subtotal ({items.length} items)</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(subtotal, currency)}
          </span>
        </div>

        {/* 2. Line Item Discounts */}
        {totalLineDiscounts > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span>Item Line Discounts</span>
            <span className="font-semibold">
              -{formatCurrency(totalLineDiscounts, currency)}
            </span>
          </div>
        )}

        {/* 3. Global Discount */}
        {globalDiscountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span>
              Overall Proposal Discount (
              {globalDiscountType === 'percentage'
                ? `${globalDiscountValue}%`
                : formatCurrency(globalDiscountValue, currency)}
              )
            </span>
            <span className="font-semibold">
              -{formatCurrency(globalDiscountAmount, currency)}
            </span>
          </div>
        )}

        {/* Total Discount Line if multiple */}
        {totalDiscount > 0 && totalLineDiscounts > 0 && globalDiscountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-medium pt-1 border-t border-dashed border-gray-100">
            <span>Total Savings / Discount</span>
            <span>-{formatCurrency(totalDiscount, currency)}</span>
          </div>
        )}

        {/* 4. Taxable Base */}
        <div className="flex items-center justify-between text-gray-700 font-medium pt-1 border-t border-gray-100">
          <span>Taxable Amount</span>
          <span className="font-bold text-gray-900">
            {formatCurrency(taxableAmount, currency)}
          </span>
        </div>

        {/* 5. Statutory Taxes */}
        {taxMode === 'per_item' ? (
          <div className="space-y-1.5 pl-2 border-l-2 border-blue-200">
            {taxGroups.length > 0 ? (
              taxGroups.map((g) => (
                <div
                  key={g.rate}
                  className="flex items-center justify-between text-gray-500 text-[11px]"
                >
                  <span>Statutory Tax ({g.rate}%)</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(g.taxAmount, currency)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                <span>Taxes</span>
                <span>{formatCurrency(totalTax, currency)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-gray-600">
            <span>Statutory Tax ({overallTaxRate}%)</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalTax, currency)}
            </span>
          </div>
        )}

        {/* 6. Additional Charges */}
        {additionalCharges.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between text-gray-500 font-medium text-[11px]">
              <span>Additional Fees & Surcharges</span>
              <span>{formatCurrency(additionalChargesTotal, currency)}</span>
            </div>
            {additionalCharges.map((chg) => (
              <div
                key={chg.id}
                className="flex items-center justify-between text-gray-600 text-[11px] pl-2"
              >
                <span>• {chg.label}</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(chg.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 7. Grand Total Highlight Box */}
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#0055FF] uppercase tracking-wider">
              Total Proposed Investment
            </div>
            <div className="text-[11px] text-gray-500">All deliverables & applicable taxes included</div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-gray-950 tracking-tight">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
        </div>

        {/* 8. Payment Milestones Schedule */}
        {paymentMilestones.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              <span>Billing Schedule</span>
              <span>
                {formatCurrency(milestonesTotal, currency)} / {formatCurrency(grandTotal, currency)}
              </span>
            </div>

            <div className="space-y-1.5">
              {paymentMilestones.map((ms, idx) => (
                <div
                  key={ms.id || idx}
                  className="flex items-center justify-between text-gray-600 text-[11px] bg-gray-50 px-2.5 py-1.5 rounded-md"
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">{ms.name}</span>
                    <span className="text-gray-400">
                      ({ms.type === 'percentage' ? `${ms.value}%` : formatCurrency(ms.value, currency)})
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatCurrency(ms.amount, currency)}
                  </span>
                </div>
              ))}
            </div>

            {remainingBalance > 0 && (
              <div className="flex items-center justify-between text-[11px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Unallocated Balance (Final Handover)</span>
                </div>
                <span className="font-bold">
                  {formatCurrency(remainingBalance, currency)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingSummary
