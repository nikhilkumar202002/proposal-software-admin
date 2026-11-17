import { useEffect } from 'react'
import { PricingTable, usePricingStore } from '../../pricing'

export const ProposalPricing = ({
  pricing = {},
  onAddItem = () => {},
  onUpdateItem = () => {},
  onRemoveItem = () => {},
  onDuplicateItem,
  onReorderItems,
  onCurrencyChange = () => {},
  onGlobalDiscountChange = () => {},
  className = '',
}) => {
  const setPricing = usePricingStore((s) => s.setPricing)
  const setCurrency = usePricingStore((s) => s.setCurrency)
  const setGlobalDiscount = usePricingStore((s) => s.setGlobalDiscount)

  // Sync pricing data to store on initial load or change
  useEffect(() => {
    if (pricing) {
      setPricing(pricing)
    }
  }, [pricing, setPricing])

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
    onCurrencyChange(newCurrency)
  }

  const handleGlobalDiscountChange = (type, val) => {
    setGlobalDiscount(type, val)
    onGlobalDiscountChange(val)
  }

  return (
    <div className={className}>
      <PricingTable
        items={pricing?.items}
        currency={pricing?.currency}
        globalDiscountType={pricing?.globalDiscountType}
        globalDiscountValue={pricing?.globalDiscountValue ?? pricing?.globalDiscount}
        taxMode={pricing?.taxMode}
        overallTaxRate={pricing?.overallTaxRate}
        additionalCharges={pricing?.additionalCharges}
        paymentMilestones={pricing?.paymentMilestones}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        onDuplicateItem={onDuplicateItem}
        onReorderItems={onReorderItems}
        onCurrencyChange={handleCurrencyChange}
        onGlobalDiscountChange={handleGlobalDiscountChange}
      />
    </div>
  )
}

export default ProposalPricing
