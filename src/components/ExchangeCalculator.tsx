import { useState } from 'react';
import { CYLINDERS } from '../data';
import { CylinderProduct } from '../types';
import { RefreshCw, ArrowRight, CheckCircle2, ShoppingCart, HelpCircle } from 'lucide-react';

interface ExchangeCalculatorProps {
  onAddExchangeToCart: (product: CylinderProduct, quantity: number, type: 'exchange' | 'new') => void;
}

export default function ExchangeCalculator({ onAddExchangeToCart }: ExchangeCalculatorProps) {
  const [ownsSize, setOwnsSize] = useState<string>('9kg'); // '5kg', '9kg', '14kg', '19kg', '48kg', 'none'
  const [needsSize, setNeedsSize] = useState<string>('9kg');
  const [quantity, setQuantity] = useState<number>(1);
  const [showExplanation, setShowExplanation] = useState(false);

  // Find products
  const ownedCylinder = CYLINDERS.find(c => c.size.includes(ownsSize));
  const desiredProduct = CYLINDERS.find(c => c.size.includes(needsSize));

  if (!desiredProduct) return null;

  // Pricing calculation
  let totalCostPerUnit = 0;
  let calculationType: 'exchange' | 'new' | 'upgrade' | 'downgrade' = 'exchange';
  let breakdownExplanation = '';
  let depositDiff = 0;

  if (ownsSize === 'none') {
    // No cylinder returned: Gas + Full Deposit
    totalCostPerUnit = desiredProduct.newPrice;
    calculationType = 'new';
    breakdownExplanation = `LPG Gas (${desiredProduct.size}): R${desiredProduct.refillPrice} + One-off Cylinder Deposit: R${desiredProduct.depositPrice}`;
  } else if (ownsSize === needsSize) {
    // Normal Exchange: Same return, same buy, just pay gas refill!
    totalCostPerUnit = desiredProduct.refillPrice;
    calculationType = 'exchange';
    breakdownExplanation = `Standard Exchange: Returned empty LPG ${ownsSize} cylinder. You pay only for Gas content.`;
  } else {
    // Trade up or down!
    // We compute the deposit difference!
    const ownedDep = ownedCylinder?.depositPrice || 0;
    const desiredDep = desiredProduct.depositPrice;
    depositDiff = desiredDep - ownedDep;

    totalCostPerUnit = desiredProduct.refillPrice + depositDiff;

    if (depositDiff > 0) {
      calculationType = 'upgrade';
      breakdownExplanation = `Upgrade Combination: LPG Gas (${desiredProduct.size}): R${desiredProduct.refillPrice} + Deposit difference (R${desiredDep} minus R${ownedDep} credit): R${depositDiff}`;
    } else {
      calculationType = 'downgrade';
      // In downgrade, they get full gas, and since their returned container is worth more, we give them a credit or count it as even.
      // Usually, businesses do a straight swap (even exchange) for safety reasons, or credit. We'll count even-exchange with 0 deposit penalty.
      totalCostPerUnit = desiredProduct.refillPrice;
      breakdownExplanation = `Straight Exchange Swap: Returned larger empty ${ownsSize} for a smaller ${needsSize}. Deposit difference waived (Straight Exchange).`;
    }
  }

  const grandTotal = totalCostPerUnit * quantity;

  const handleAddToCart = () => {
    // Add to cart with correct type
    onAddExchangeToCart(desiredProduct, quantity, ownsSize === 'none' ? 'new' : 'exchange');
  };

  return (
    <div 
      className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-navy-100/80 relative overflow-hidden"
      id="exchange-calculator-card"
    >
      {/* Background orange/navy gradient highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gas-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-navy-900/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gas-orange-50 text-gas-orange-500 rounded-2xl border border-gas-orange-100">
          <RefreshCw className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl md:text-2xl text-navy-900 tracking-tight">
            Exchange Cylinder Pricing Calculator
          </h3>
          <p className="text-sm text-navy-500">
            Calculate your direct trade savings by matching your empty cylinder
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Step 1: Tell us what you own */}
        <div className="md:col-span-5 space-y-3">
          <label className="block text-xs font-mono font-bold tracking-wider text-navy-600 uppercase">
            STEP 1: What empty bottle do you have?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['5kg', '9kg', '14kg', '19kg', '48kg'].map((sz) => (
              <button
                key={`own-${sz}`}
                onClick={() => setOwnsSize(sz)}
                className={`py-2 px-1 text-center font-display font-semibold text-sm rounded-xl border transition-all cursor-pointer ${
                  ownsSize === sz
                    ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-navy-400'
                    : 'bg-navy-50/50 text-navy-700 border-navy-100 hover:bg-navy-50 hover:border-navy-200'
                }`}
                id={`btn-owns-${sz}`}
              >
                {sz}
              </button>
            ))}
            <button
              onClick={() => setOwnsSize('none')}
              className={`py-2 px-1 col-span-3 text-center font-display font-semibold text-xs rounded-xl border transition-all cursor-pointer truncate ${
                ownsSize === 'none'
                  ? 'bg-gas-orange-500 text-white border-gas-orange-500 shadow-md ring-2 ring-gas-orange-300'
                  : 'bg-navy-50/50 text-navy-700 border-navy-100 hover:bg-navy-50 hover:border-navy-200'
              }`}
              id="btn-owns-none"
            >
              ❌ No Empty Bottle (New Rental Needed)
            </button>
          </div>

          <div className="p-3 bg-navy-50 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-200 flex items-center justify-center font-mono font-bold text-navy-800 text-xs shrink-0">
              {ownsSize === 'none' ? '0' : ownsSize.replace('kg', '')}
            </div>
            <div className="text-xs text-navy-600 leading-snug">
              {ownsSize === 'none' ? (
                <span>You will buy a new cylinder + brand-new LPG gas deposit.</span>
              ) : (
                <span>Returning a standard empty <strong>{ownsSize}</strong> bottle saves deposit fees!</span>
              )}
            </div>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="md:col-span-2 flex justify-center">
          <div className="bg-gas-orange-50 text-gas-orange-600 p-2.5 rounded-full border border-gas-orange-100 md:rotate-0 rotate-90 my-2">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Step 2: Tell us what you need */}
        <div className="md:col-span-5 space-y-3">
          <label className="block text-xs font-mono font-bold tracking-wider text-navy-600 uppercase">
            STEP 2: What refill size do you need?
          </label>
          <div className="grid grid-cols-5 gap-1.5 md:grid-cols-5">
            {['5kg', '9kg', '14kg', '19kg', '48kg'].map((sz) => (
              <button
                key={`need-${sz}`}
                onClick={() => setNeedsSize(sz)}
                className={`py-2 text-center font-display font-bold text-sm rounded-xl border transition-all cursor-pointer ${
                  needsSize === sz
                    ? 'bg-gas-orange-500 text-white border-gas-orange-600 shadow-md ring-2 ring-gas-orange-300'
                    : 'bg-navy-50/50 text-navy-700 border-navy-100 hover:bg-navy-50 hover:border-navy-200'
                }`}
                id={`btn-needs-${sz}`}
              >
                {sz.replace('kg', '')}
                <span className="block text-[8px] opacity-75">kg</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-gas-orange-50/50 rounded-xl flex items-center gap-3 border border-gas-orange-100/50">
            <div className="w-8 h-8 rounded-lg bg-gas-orange-100 flex items-center justify-center font-mono font-bold text-gas-orange-700 text-xs shrink-0">
              {needsSize.replace('kg', '')}
            </div>
            <div className="text-xs text-navy-600 leading-snug">
              Delivering full-tank certified <strong>{needsSize}</strong> LPG cylinder.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-navy-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Quantity selector and breakdown */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-navy-800">Quantity:</span>
            <div className="flex items-center border border-navy-200 rounded-xl overflow-hidden bg-navy-50/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-navy-600 hover:bg-navy-100 font-bold text-lg focus:outline-none transition-colors"
                id="btn-calc-qty-minus"
              >
                -
              </button>
              <span className="px-4 py-1.5 font-mono font-bold text-navy-900 bg-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-navy-600 hover:bg-navy-100 font-bold text-lg focus:outline-none transition-colors"
                id="btn-calc-qty-plus"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-navy-700 font-mono">COST BREAKDOWN:</span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-navy-400 hover:text-navy-600 transition-colors cursor-pointer"
                title="Explain the LPG conversion standard"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-navy-500 bg-navy-50 p-2.5 rounded-lg border border-navy-100 italic">
              {breakdownExplanation}
            </p>

            {showExplanation && (
              <div className="text-xs bg-amber-50/60 text-amber-900 p-3 rounded-xl border border-amber-100 space-y-1 mt-1 transition-all">
                <p className="font-semibold">How South African Gas Exchange Pricing Works:</p>
                <p>
                  Because empty cylinders are expensive (R450 - R1800 deposit value), you carry a deposit credit if you hand in an equivalent empty cylinder.
                </p>
                <p>
                  • <strong>Straight Swap:</strong> returning an empty cylinder of equivalent size means you pay ONLY for gas refill content.
                </p>
                <p>
                  • <strong>Upgrade Switch:</strong> exchanging a smaller empty for a larger full requires paying only the modest deposit difference inside South Africa.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing display and Cart Trigger */}
        <div className="md:col-span-6 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4">
          <div className="text-center sm:text-right">
            <div className="text-xs font-mono font-bold tracking-wider text-navy-400 uppercase">
              ESTIMATED ORDER TOTAL
            </div>
            <div className="flex items-baseline justify-center sm:justify-end gap-1 text-navy-900 font-display font-black text-3xl md:text-4xl">
              <span className="text-xl font-bold text-gas-orange-500">R</span>
              <span>{grandTotal.toLocaleString('en-ZA')}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              🚚 Excl. delivery (calculated at checkout)
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-gas-orange-500 hover:bg-gas-orange-600 active:bg-gas-orange-700 text-white font-display font-extrabold text-sm px-6 py-4 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            id="btn-add-calc-to-cart"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Apply Exchange Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
