import { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Receipt } from 'lucide-react'
import PricingRow from './PricingRow'
import PricingToolbar from './PricingToolbar'
import PricingSummary from './PricingSummary'
import PricingSettings from './PricingSettings'
import { usePricing } from '../hooks/usePricing'

export const PricingTable = ({
  // Optional controlled props override if passed from parent
  items: propItems,
  currency: propCurrency,
  globalDiscountType: propGlobalDiscountType,
  globalDiscountValue: propGlobalDiscountValue,
  taxMode: propTaxMode,
  overallTaxRate: propOverallTaxRate,
  additionalCharges: propAdditionalCharges,
  paymentMilestones: propPaymentMilestones,
  onAddItem: propOnAddItem,
  onUpdateItem: propOnUpdateItem,
  onRemoveItem: propOnRemoveItem,
  onDuplicateItem: propOnDuplicateItem,
  onReorderItems: propOnReorderItems,
  onCurrencyChange: propOnCurrencyChange,
  onGlobalDiscountChange: propOnGlobalDiscountChange,
  onTaxModeChange: propOnTaxModeChange,
  disabled = false,
  className = '',
}) => {
  const store = usePricing()

  // Use props if provided, otherwise fallback to hook/store
  const items = propItems || store.items
  const currency = propCurrency || store.currency
  const globalDiscountType = propGlobalDiscountType || store.globalDiscountType
  const globalDiscountValue =
    propGlobalDiscountValue !== undefined ? propGlobalDiscountValue : store.globalDiscountValue
  const taxMode = propTaxMode || store.taxMode
  const overallTaxRate =
    propOverallTaxRate !== undefined ? propOverallTaxRate : store.overallTaxRate
  const additionalCharges = propAdditionalCharges || store.additionalCharges
  const paymentMilestones = propPaymentMilestones || store.paymentMilestones

  const currencyConfig = store.currencyConfig
  const summary = store.summary

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const itemIds = useMemo(() => items.map((i) => i.id), [items])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      if (propOnReorderItems) {
        propOnReorderItems(active.id, over.id)
      }
      store.reorderItems(active.id, over.id)
    }
  }

  const handleAddItem = (custom) => {
    if (propOnAddItem) propOnAddItem(custom)
    else store.addItem(custom)
  }

  const handleUpdateItem = (id, updates) => {
    if (propOnUpdateItem) propOnUpdateItem(id, updates)
    else store.updateItem(id, updates)
  }

  const handleRemoveItem = (id) => {
    if (propOnRemoveItem) propOnRemoveItem(id)
    else store.removeItem(id)
  }

  const handleDuplicateItem = (id) => {
    if (propOnDuplicateItem) propOnDuplicateItem(id)
    else store.duplicateItem(id)
  }

  const handleCurrencyChange = (newCurr) => {
    if (propOnCurrencyChange) propOnCurrencyChange(newCurr)
    else store.setCurrency(newCurr)
  }

  const handleGlobalDiscountChange = (type, val) => {
    if (propOnGlobalDiscountChange) propOnGlobalDiscountChange(type, val)
    else store.setGlobalDiscount(type, val)
  }

  const handleTaxModeChange = (mode) => {
    if (propOnTaxModeChange) propOnTaxModeChange(mode)
    else store.setTaxMode(mode)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Pricing Toolbar */}
      <PricingToolbar
        onAddItem={() => handleAddItem()}
        onAddPreset={(preset) => handleAddItem(preset)}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        taxMode={taxMode}
        onTaxModeChange={handleTaxModeChange}
        itemCount={items.length}
        disabled={disabled}
      />

      {/* 2. Interactive Sortable Pricing Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50/70 select-none">
                <th className="py-3 px-2 text-center w-12">#</th>
                <th className="py-3 px-3 min-w-[240px]">Deliverable Item</th>
                <th className="py-3 px-2 w-20 text-center">Qty</th>
                <th className="py-3 px-2 w-28">Unit</th>
                <th className="py-3 px-2 w-32 text-right">Unit Price</th>
                <th className="py-3 px-2 w-32 text-center">Discount</th>
                {taxMode === 'per_item' ? (
                  <th className="py-3 px-2 w-32 text-center">Tax Rate</th>
                ) : (
                  <th className="py-3 px-2 w-24 text-center">Tax</th>
                )}
                <th className="py-3 px-3 w-32 text-right">Line Total</th>
                <th className="py-3 px-2 w-20 text-center">Actions</th>
              </tr>
            </thead>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <PricingRow
                        key={item.id}
                        item={item}
                        index={index}
                        currency={currency}
                        currencySymbol={currencyConfig.symbol}
                        taxMode={taxMode}
                        onUpdate={handleUpdateItem}
                        onRemove={handleRemoveItem}
                        onDuplicate={handleDuplicateItem}
                        disabled={disabled}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Receipt className="w-8 h-8 mb-2 stroke-[1.5]" />
                          <p className="text-sm font-semibold text-gray-600">No deliverable items added yet</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-sm">
                            Add billable milestones, license seats, hourly retainers, or select from pre-defined presets.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddItem()}
                            disabled={disabled}
                            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#FB6C00] hover:bg-[#E65F00] rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add First Deliverable</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      </div>

      {/* 3. Pricing Adjustments, Additional Charges & Payment Milestones */}
      <PricingSettings
        currency={currency}
        currencySymbol={currencyConfig.symbol}
        taxMode={taxMode}
        overallTaxRate={overallTaxRate}
        onOverallTaxRateChange={(r) => store.setOverallTaxRate(r)}
        globalDiscountType={globalDiscountType}
        globalDiscountValue={globalDiscountValue}
        onGlobalDiscountChange={handleGlobalDiscountChange}
        additionalCharges={additionalCharges}
        onAddAdditionalCharge={(c) => store.addAdditionalCharge(c)}
        onUpdateAdditionalCharge={(id, u) => store.updateAdditionalCharge(id, u)}
        onRemoveAdditionalCharge={(id) => store.removeAdditionalCharge(id)}
        paymentMilestones={paymentMilestones}
        onAddPaymentMilestone={(m) => store.addPaymentMilestone(m)}
        onUpdatePaymentMilestone={(id, u) => store.updatePaymentMilestone(id, u)}
        onRemovePaymentMilestone={(id) => store.removePaymentMilestone(id)}
        onApplyMilestonePreset={(pm) => store.applyMilestonePreset(pm)}
        grandTotal={summary.grandTotal}
        disabled={disabled}
      />

      {/* 4. Pricing Financial Summary Card */}
      <PricingSummary summary={summary} currency={currency} />
    </div>
  )
}

export default PricingTable
