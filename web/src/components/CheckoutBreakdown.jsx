import React from 'react'

const CheckoutBreakdown = ({ basePrice = 0, discount = 0, gstRate = 0.18, couponData = null, className = '', compact = false }) => {
  const format = (v) => `₹${Number(v || 0).toFixed(2)}`
  const discountedBase = Math.max(0, basePrice - discount)
  const gstAmount = discountedBase * Number(gstRate || 0)
  const total = discountedBase + gstAmount
  const savingsPercent = couponData && couponData.discountType === 'percentage' && couponData.discountPercent

  if (compact) {
    return (
      <div className={`rounded-none p-4 bg-black/70 border border-white/20 backdrop-blur-md shadow-lg max-w-sm ${className}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-[12px] font-semibold text-slate-300">Price Breakdown</h4>
            {savingsPercent && <span className="inline-block mt-0.5 text-[10px] text-green-400 font-bold">Save {savingsPercent}% with code</span>}
          </div>
          {couponData?.code && (
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-none font-mono font-bold">
              {couponData.code}
            </span>
          )}
        </div>

        <dl className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <dt>Base Price</dt>
            <dd className="font-semibold">{format(basePrice)}</dd>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-emerald-400">
              <dt>Discount</dt>
              <dd className="font-bold">-{format(discount)}</dd>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-300">
            <dt>GST ({(Number(gstRate || 0) * 100).toFixed(0)}%)</dt>
            <dd className="font-semibold">{format(gstAmount)}</dd>
          </div>

          <div className="h-[1px] bg-white/10 my-2" />

          <div className="flex justify-between items-center text-white">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold text-blue-400 text-sm">{format(total)}</dd>
          </div>
        </dl>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-slate-300 shadow-sm rounded-none p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">Price Breakdown</h4>
          {savingsPercent && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-none font-semibold">
              Save {savingsPercent}% with code
            </span>
          )}
        </div>
        {couponData?.code && (
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-300 px-2.5 py-1 rounded-none font-mono font-bold">
            {couponData.code}
          </span>
        )}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-slate-600">
          <dt>Base Course Price</dt>
          <dd className="font-semibold text-slate-900">{format(basePrice)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <dt className="flex items-center gap-1 font-medium">Coupon Discount</dt>
            <dd className="font-bold">-{format(discount)}</dd>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600">
          <dt>GST ({(Number(gstRate || 0) * 100).toFixed(0)}%)</dt>
          <dd className="font-semibold text-slate-900">{format(gstAmount)}</dd>
        </div>

        <div className="h-[1px] bg-slate-200 my-2" />

        <div className="flex justify-between items-center text-slate-900">
          <dt className="font-bold text-base">Total Amount</dt>
          <dd className="font-bold text-xl text-blue-700">{format(total)}</dd>
        </div>
      </dl>

      <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
        You will be charged the exact amount above. Taxes are computed after discounts are applied.
      </p>
    </div>
  )
}

export default CheckoutBreakdown
