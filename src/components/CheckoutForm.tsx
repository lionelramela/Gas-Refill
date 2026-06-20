import React, { useState } from 'react';
import { CartItem, ServiceArea } from '../types';
import { Send, CheckCircle, Copy, Check, Calendar, MapPin, Smartphone, User, Mail, DollarSign } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: CartItem[];
  selectedArea: ServiceArea | null;
  onClearCart: () => void;
  onClose: () => void;
}

export default function CheckoutForm({ cartItems, selectedArea, onClearCart, onClose }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsAppNumber: '',
    emailAddress: '',
    deliveryAddress: '',
    preferredDate: '',
    notes: '',
    paymentMethod: 'Instant EFT' // 'Instant EFT', 'Cash on Delivery', 'Card Swipe on Delivery'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [formattedMsg, setFormattedMsg] = useState('');

  // Calculation
  const itemsTotal = cartItems.reduce((acc, item) => {
    const price = item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice;
    return acc + (price * item.quantity);
  }, 0);

  const deliveryFee = selectedArea ? selectedArea.deliveryFee : 0;
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeDelivery = totalQty >= 3;
  const activeDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = itemsTotal + activeDeliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    const itemsStr = cartItems.map(item => {
      const label = item.type === 'exchange' ? 'Exchange (Only Gas)' : 'New Combo (Gas+Deposit)';
      const unitPrice = item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice;
      return `• ${item.quantity}x ${item.product.size} - ${label} [R${unitPrice} ea = R${unitPrice * item.quantity}]`;
    }).join('\n');

    const paymentText = formData.paymentMethod;

    return `🔥 *LPG GAS ORDER DISPATCH REQUEST*
---------------------------------------
👤 *Customer:* ${formData.fullName}
📞 *Mobile:* ${formData.mobileNumber}
💬 *WhatsApp:* ${formData.whatsAppNumber || formData.mobileNumber}
✉️ *Email:* ${formData.emailAddress || 'Not Provided'}
📍 *Delivery Suburb:* ${selectedArea?.name || 'N/A'}
🏠 *Address:* ${formData.deliveryAddress}
📅 *Preferred Date:* ${formData.preferredDate}
💳 *Payment:* ${paymentText}
📝 *Notes:* ${formData.notes || 'None'}

📦 *ORDER ITEMS SUMMARY:*
${itemsStr}

💰 *TOTAL PRICING DUED:*
Subtotal: R${itemsTotal}
Delivery Fee: R${activeDeliveryFee} ${isFreeDelivery ? '(3+ Cylinder promo applied)' : ''}
*TOTAL DUE: R${grandTotal}*

---------------------------------------
🔄 _Please verify details. Let\'s dispatch your gas order right now!_`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const textMsg = generateWhatsAppMessage();
    setFormattedMsg(textMsg);
    setIsSubmitted(true);

    // Business WhatsApp Number (Typically a 10-digit SA cellular number formats to 27xxxxxxxxx)
    const encodedText = encodeURIComponent(textMsg);
    const whatsappUrl = `https://wa.me/27821234567?text=${encodedText}`;

    // Open WhatsApp link
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedMsg);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Safe Tomorrow Date for input min
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  if (isSubmitted) {
    return (
      <div 
        className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-navy-100 text-center space-y-6 max-w-2xl mx-auto"
        id="order-success-screen"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-black text-2xl md:text-3xl text-navy-900 tracking-tight">
            Order Submitted & Pending Dispatch!
          </h3>
          <p className="text-sm text-navy-500 max-w-md mx-auto leading-relaxed">
            We have prepared your order details and attempted to launch WhatsApp. Please make sure the formatted text matches your request below to confirm delivery times.
          </p>
        </div>

        {/* Formatted message presentation container */}
        <div className="bg-navy-50 text-left p-5 rounded-2xl border border-navy-100 font-mono text-xs text-navy-800 whitespace-pre-wrap max-h-60 overflow-y-auto relative">
          <button
            onClick={handleCopyText}
            className="absolute top-3 right-3 p-1.5 bg-white hover:bg-navy-100 border border-navy-200 rounded-lg text-navy-600 flex items-center gap-1 transition-all cursor-pointer text-[10px]"
            id="copy-whatsapp-text-btn"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Copy</span>
              </>
            )}
          </button>
          {formattedMsg}
        </div>

        {/* Follow up user directions */}
        <div className="p-4 bg-gas-orange-50 text-gas-orange-950 rounded-2xl border border-gas-orange-100 text-xs leading-relaxed max-w-md mx-auto">
          <strong>⚠️ High Priority next step:</strong> If the WhatsApp application did not load or focus, please copy the text above using the button, and paste it to our friendly local dispatch agent via direct WhatsApp chat!
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <a
            href={`https://wa.me/27821234567?text=${encodeURIComponent(formattedMsg)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
            id="retry-whatsapp-link"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Launch WhatsApp Again</span>
          </a>

          <button
            onClick={() => {
              onClearCart();
              setIsSubmitted(false);
              onClose();
            }}
            className="bg-navy-900 hover:bg-navy-800 text-white font-display font-bold text-sm px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            id="order-success-dismiss"
          >
            Clear Order & Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-navy-100"
      id="checkout-order-form-container"
    >
      <div className="mb-6">
        <h3 className="font-display font-black text-xl md:text-2xl text-navy-900 tracking-tight">
          Complete Your Delivery Booking
        </h3>
        <p className="text-xs text-navy-500 mt-1">
          Provide your local South African location and contact information to finalize your gas dispatch.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-navy-400" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Hendrik van der Merwe"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-full-name"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-navy-400" />
              <span>Email Address (Optional)</span>
            </label>
            <input
              type="email"
              name="emailAddress"
              placeholder="e.g. name@domain.co.za"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-email"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-navy-400" />
              <span>Mobile Phone *</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              required
              placeholder="e.g. 082 123 4567"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-mobile"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp Phone *</span>
            </label>
            <input
              type="tel"
              name="whatsAppNumber"
              required
              placeholder="e.g. 082 123 4567"
              value={formData.whatsAppNumber}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-whatsapp"
            />
          </div>
        </div>

        {/* Region visual state badge */}
        <div className="p-3 bg-navy-900 text-white rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gas-orange-400" />
            <div className="text-left">
              <span className="text-[10px] text-navy-300 font-mono block">Selected Delivery Area:</span>
              <strong className="text-xs font-display">{selectedArea?.name || 'Pretoria/Centurion'} Area</strong>
            </div>
          </div>
          <span className="text-xs font-mono bg-navy-800 text-gas-orange-400 px-3 py-1 rounded-lg">
            Delivery Fee: R{activeDeliveryFee}
          </span>
        </div>

        {/* Physical Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-navy-400" />
            <span>Delivery Street Address, Suburb & Apartment No. *</span>
          </label>
          <input
            type="text"
            name="deliveryAddress"
            required
            placeholder="e.g. 14 Tulip Close, Garsfontein"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
            id="input-delivery-address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Preferred Delivery Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-navy-400" />
              <span>Preferred Delivery Date *</span>
            </label>
            <input
              type="date"
              name="preferredDate"
              required
              min={minDateString}
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-delivery-date"
            />
          </div>

          {/* Payment Method Selected */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-navy-400" />
              <span>Payment Type Prefered *</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
              id="input-payment-method"
            >
              <option value="Instant EFT on Invoice">Instant EFT (Invoice on Receipt)</option>
              <option value="Cash on Delivery">Cash on Delivery (COD)</option>
              <option value="Card Swipe on Delivery">Speedpoint Card Swipe on Delivery</option>
            </select>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold tracking-wider text-navy-600 uppercase">
            Additional Delivery Instructions or Gate Codes
          </label>
          <textarea
            name="notes"
            rows={2}
            placeholder="e.g. Ring intercom bell #3, or please bring soap-water kit to check connections on cylinder valve."
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 transition-all font-medium"
            id="input-delivery-notes"
          />
        </div>

        {/* Proceed Trigger button */}
        <div className="pt-4 border-t border-navy-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold block text-navy-400 uppercase">
              DEBIT TOTAL PAYABLE:
            </span>
            <span className="text-xl md:text-2xl font-display font-black text-navy-900">
              R{grandTotal.toLocaleString('en-ZA')}
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3.5 cursor-pointer"
            id="btn-trigger-checkout"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Confirm Order Via WhatsApp</span>
          </button>
        </div>
      </form>
    </div>
  );
}
