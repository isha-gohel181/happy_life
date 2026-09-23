import React from 'react'

const CheckoutBreakdown = ({ basePrice = 0, discount = 0, gstRate = 0.18, couponData = null, className = '', compact = false }) => {
  const format = (v) => `₹${Number(v || 0).toFixed(2)}`
  const discountedBase = Math.max(0, basePrice - discount)
  const gstAmount = discountedBase * Number(gstRate || 0)
  const total = discountedBase + gstAmount
  const savingsPercent = couponData && couponData.discountType === 'percentage' && couponData.discountPercent

  return (
    <div className={`rounded-lg p-4 ${compact ? 'bg-gradient-to-b from-black/60 to-transparent border border-white/5 shadow-lg max-w-sm' : 'bg-white/[0.02] border border-white/10 shadow-xl max-w-md w-full mx-auto'} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-[13px] font-jetbrains text-normal/70">Price Breakdown</h4>
          {savingsPercent && <span className="inline-block mt-1 text-[10px] text-green-400 uppercase font-black">Save {savingsPercent}% with code</span>}
        </div>
        {couponData?.code && (
          <div className="text-[11px] text-accent font-black uppercase">{couponData.code}</div>
        )}
      </div>

      <dl className="space-y-2">
        <div className="flex justify-between items-center">
          <dt className="text-[12px] text-normal/70">Base Price</dt>
          <dd className="font-black text-[12px]">{format(basePrice)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-red-400">
            <dt className="text-[12px]">Discount</dt>
            <dd className="font-black">-{format(discount)}</dd>
          </div>
        )}

        <div className="flex justify-between items-center">
          <dt className="text-[12px] text-normal/70">GST ({(Number(gstRate || 0) * 100).toFixed(2)}%)</dt>
          <dd className="font-black">{format(gstAmount)}</dd>
        </div>

        <div className="h-[1px] bg-white/5 my-3" />

        <div className="flex justify-between items-center">
          <dt className="text-[14px] text-normal/80 font-bold">Total</dt>
          <dd className="font-newsreader italic text-[20px] text-accent font-extralight">{format(total)}</dd>
        </div>
      </dl>

      {!compact && (
        <p className="mt-3 text-[11px] text-normal/60">You will be charged the amount shown above. Taxes are calculated after discounts are applied.</p>
      )}
    </div>
  )
}

export default CheckoutBreakdown
