import { CartItem, ServiceArea } from '../types';
import { ShoppingCart, Trash2, ShieldCheck, X, Truck, ArrowRight, CornerDownRight } from 'lucide-react';
import { SERVICE_AREAS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, type: 'exchange' | 'new', newQty: number) => void;
  onRemoveItem: (productId: string, type: 'exchange' | 'new') => void;
  selectedArea: ServiceArea | null;
  onSelectArea: (area: ServiceArea) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  selectedArea,
  onSelectArea,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Calculate items total
  const itemsTotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice;
    return acc + (unitPrice * item.quantity);
  }, 0);

  // Delivery Fee
  const deliveryFee = selectedArea ? selectedArea.deliveryFee : 0;
  
  // Bulky discount: If order has 3 or more cylinders, we discount delivery fee to R0!
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeDelivery = totalQty >= 3;
  const activeDeliveryFee = isFreeDelivery ? 0 : deliveryFee;

  const grandTotal = itemsTotal + activeDeliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full rounded-l-3xl border-l border-navy-100">
          {/* Header */}
          <div className="px-6 py-5 border-b border-navy-100 flex items-center justify-between bg-navy-900 text-white rounded-tl-3xl">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gas-orange-400" />
              <h3 className="font-display font-black text-lg tracking-tight">Your Gas Order</h3>
              <span className="bg-gas-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {cartItems.length} items
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 px-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white transition-colors cursor-pointer"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-navy-50 text-navy-400 rounded-full flex items-center justify-center border border-navy-100">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-navy-800 text-base">Your Cart is Empty</h4>
                  <p className="text-xs text-navy-400 max-w-xs mt-1">
                    Select dynamic cylinder refills or exchange packages from the catalog to see them here.
                  </p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice;
                const totalCylinderPrice = itemPrice * item.quantity;
                return (
                  <div 
                    key={`${item.product.id}-${item.type}`}
                    className="flex gap-4 p-4 rounded-2xl bg-navy-50/50 border border-navy-100/50 hover:bg-navy-50 transition-colors"
                    id={`cart-item-${item.product.id}-${item.type}`}
                  >
                    {/* Tiny cylinder graphic thumbnail representation */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs"
                      style={{ backgroundColor: item.product.color }}
                    >
                      {item.product.sizeNum}kg
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-navy-950 truncate">
                            {item.product.size}
                          </h4>
                          <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-md font-medium mt-0.5 ${
                            item.type === 'exchange' 
                              ? 'bg-gas-orange-50 text-gas-orange-700 border border-gas-orange-100' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {item.type === 'exchange' ? '🔄 Cylinder Exchange' : '📦 New Combo Rental'}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.type)}
                          className="text-navy-300 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                          id={`btn-remove-cart-${item.product.id}-${item.type}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-navy-500">
                          <span>R{itemPrice}</span>
                          <span>×</span>
                          <span>{item.quantity}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-lg overflow-hidden border border-navy-200 text-xs">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.type, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 hover:bg-navy-50 text-navy-600 font-bold transition-colors"
                              id={`btn-cart-minus-draw-${item.product.id}-${item.type}`}
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-semibold text-navy-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.type, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-navy-50 text-navy-600 font-bold transition-colors"
                              id={`btn-cart-plus-draw-${item.product.id}-${item.type}`}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-xs font-bold text-navy-900 font-mono">
                            R{totalCylinderPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pricing Calculation Summary Section */}
          <div className="p-6 bg-navy-50/50 border-t border-navy-100 space-y-4">
            {/* Free Delivery Promo Bar */}
            {cartItems.length > 0 && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Bulk Order FREE Delivery Promo</span>
                  </div>
                  <span className="font-mono font-bold">{totalQty}/3 cylinders</span>
                </div>
                <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all" 
                    style={{ width: `${Math.min(100, (totalQty / 3) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-emerald-700 leading-snug">
                  {isFreeDelivery 
                    ? "🎉 Congratulations! Delivery is FREE because you ordered 3 or more cylinders!" 
                    : `Add ${3 - totalQty} more cylinders to unlock completely FREE delivery to any service area!`
                  }
                </p>
              </div>
            )}

            {/* Service Area Selector Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold tracking-wider text-navy-500 uppercase">
                DELIVERY REGION / SUBURB:
              </label>
              <select
                value={selectedArea?.name || ''}
                onChange={(e) => {
                  const area = SERVICE_AREAS.find(a => a.name === e.target.value);
                  if (area) onSelectArea(area);
                }}
                className="w-full bg-white border border-navy-200 rounded-xl px-3 py-2.5 text-xs text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 font-medium"
                id="cart-area-select"
              >
                <option value="" disabled>-- Select Your Delivery Area --</option>
                {SERVICE_AREAS.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} (Delivery fee: R{area.deliveryFee})
                  </option>
                ))}
              </select>
              {selectedArea && (
                <div className="flex gap-1.5 text-[10px] text-navy-500 font-mono mt-1">
                  <CornerDownRight className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                  <span>Suburbs: {selectedArea.description} • {selectedArea.deliveryTime}</span>
                </div>
              )}
            </div>

            {/* Totals Breakdown list */}
            <div className="space-y-2 text-xs text-navy-700 pt-2">
              <div className="flex justify-between items-center">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold">R{itemsTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>
                  Delivery Fee:
                  {isFreeDelivery && <span className="text-[9px] text-emerald-600 font-bold ml-1.5">(Promo applied)</span>}
                </span>
                <span className="font-mono font-bold">
                  {selectedArea 
                    ? (isFreeDelivery ? 'FREE' : `R${deliveryFee}`) 
                    : 'Select area above'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-navy-950 pt-2 border-t border-navy-100 font-bold">
                <span className="font-display">Estimated Total:</span>
                <span className="font-mono text-base text-gas-orange-500">
                  R{grandTotal.toLocaleString('en-ZA')}
                </span>
              </div>
            </div>

            {/* Proceed to checkout trigger */}
            <button
              onClick={onProceedToCheckout}
              disabled={cartItems.length === 0 || !selectedArea}
              className={`w-full font-display font-extrabold text-sm py-4 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer ${
                cartItems.length === 0 || !selectedArea
                  ? 'bg-navy-200 text-navy-400 cursor-not-allowed'
                  : 'bg-gas-orange-500 hover:bg-gas-orange-600 text-white active:scale-95'
              }`}
              id="proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* Secure Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-navy-400 text-center font-mono leading-none pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Certified High-Grade Gas Suppliers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
