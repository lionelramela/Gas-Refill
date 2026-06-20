import React, { useState, useEffect, useRef } from 'react';
import Cylinder3D from './components/Cylinder3D';
import { 
  Flame, 
  ShoppingCart, 
  Phone, 
  ShieldAlert, 
  Truck, 
  MapPin, 
  HelpCircle, 
  Check, 
  CheckCircle2, 
  Clock, 
  Menu, 
  X, 
  ChevronDown, 
  Award, 
  ShieldCheck, 
  Star, 
  Send, 
  MessageSquare, 
  CheckCircle,
  TrendingUp,
  AlertOctagon,
  Settings,
  Shield
} from 'lucide-react';

import { CYLINDERS, SERVICE_AREAS, REVIEWS, FAQS } from './data';
import { CylinderProduct, CartItem, ServiceArea } from './types';
import ExchangeCalculator from './components/ExchangeCalculator';
import CylinderCard from './components/CylinderCard';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // FAQ accordion tracking
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  
  // Contact Form state representation
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Scroll transparency state
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set default area to make totals immediately understandable
  useEffect(() => {
    if (SERVICE_AREAS.length > 0) {
      setSelectedArea(SERVICE_AREAS[0]); // Default to Pretoria
    }
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: CylinderProduct, quantity: number, type: 'exchange' | 'new') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.type === type);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, type }];
    });
  };

  const handleUpdateCartQty = (productId: string, type: 'exchange' | 'new', newQty: number) => {
    setCartItems(prev => 
      prev.map(item => 
        (item.product.id === productId && item.type === type)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, type: 'exchange' | 'new') => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.type === type)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Pre-configured smooth scrolls
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Math totals for badges
  const cartQtyCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeDelivery = cartQtyCount >= 3;
  const deliveryFee = selectedArea ? selectedArea.deliveryFee : 0;
  const activeDeliveryFee = isFreeDelivery ? 0 : deliveryFee;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-soft select-text">
      
      {/* Dynamic Safety Alert Header Ticker bar */}
      <div className="bg-navy-950 text-white text-xs font-mono py-2 px-4 border-b border-navy-900 overflow-hidden relative" id="header-safety-ticker">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gas-orange-500 animate-ping"></span>
            <span className="text-navy-300">Winter Gas Specials Live • Same Day Pretoria & Centurion LPG Dispatch</span>
          </div>
          <div className="flex items-center gap-4 text-navy-400">
            <span>🛡️ LPGSA Certified Safe Distributor</span>
            <span>📱 Order Hotline: <strong>+27 82 123 4567</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <header 
        className={`sticky top-0 z-40 transition-all ${
          scrolled 
            ? 'bg-navy-900/95 backdrop-blur-md shadow-lg py-3 text-white' 
            : 'bg-white py-4 text-navy-900 border-b border-navy-100'
        }`}
        id="main-app-header"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Business branding logo */}
          <div 
            onClick={() => scrollToSection('hero-home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gas-orange-500 text-white flex items-center justify-center shadow-md shadow-gas-orange-500/20 group-hover:rotate-12 transition-transform">
              <Flame className="w-5 h-5 fill-current animate-pulse-slow" />
            </div>
            <div>
              <span className={`font-display font-black text-lg md:text-xl tracking-tight leading-none block ${scrolled ? 'text-white' : 'text-navy-900'}`}>
                SINOVILLE <span className="text-gas-orange-500">GAS</span>
              </span>
              <span className={`text-[9px] font-mono tracking-widest uppercase block ${scrolled ? 'text-navy-300' : 'text-navy-400'}`}>
                LGP EXPERT DISTRIBUTIONS
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            {['Cylinder Catalog', 'Exchange Calculator', 'Why Us', 'Service Areas', 'FAQs', 'Contact Us'].map((label, idx) => {
              const ids = ['catalog-section', 'calculator-section', 'why-us-section', 'areas-section', 'faqs-section', 'contact-section'];
              return (
                <button
                  key={idx}
                  onClick={() => scrollToSection(ids[idx])}
                  className={`transition-colors cursor-pointer hover:text-gas-orange-500 ${
                    scrolled ? 'text-navy-200 hover:text-white' : 'text-navy-700 hover:text-navy-950'
                  }`}
                  id={`nav-link-${idx}`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Navigation Action controls */}
          <div className="flex items-center gap-3">
            {/* Quick Phone Call icon for quick booking */}
            <a
              href="tel:+27821234567"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scrolled
                  ? 'bg-navy-800 hover:bg-navy-700 text-white'
                  : 'bg-navy-100 hover:bg-navy-200 text-navy-900'
              }`}
            >
              <Phone className="w-4 h-4 text-gas-orange-500" />
              <span>Call Hotline</span>
            </a>

            {/* Quick message WhatsApp call banner */}
            <a
              href="https://wa.me/27821234567?text=Hi!%20I%20would%20like%20to%20order%20LPG%20gas%20refill."
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors sm:flex hidden"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            {/* Floating cart Trigger block button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gas-orange-500 hover:bg-gas-orange-600 text-white px-4 py-2.5 rounded-xl font-display font-black text-xs transition-all flex items-center gap-2 cursor-pointer relative shadow-md shadow-gas-orange-500/10 active:scale-95"
              id="sticky-cart-launcher"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Cart</span>
              {cartQtyCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-navy-950 text-white rounded-full flex items-center justify-center text-[10px] font-mono font-bold border border-white">
                  {cartQtyCount}
                </span>
              )}
            </button>

            {/* Mobile menu Toggle toggle bar */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-navy-100 hover:bg-navy-50/50 cursor-pointer text-current"
              id="mobile-hamburger-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-navy-100 py-4 px-6 space-y-3 shadow-inner">
            {['Cylinder Catalog', 'Exchange Calculator', 'Why Us', 'Service Areas', 'FAQs', 'Contact Us'].map((label, idx) => {
              const ids = ['catalog-section', 'calculator-section', 'why-us-section', 'areas-section', 'faqs-section', 'contact-section'];
              return (
                <button
                  key={idx}
                  onClick={() => scrollToSection(ids[idx])}
                  className="block w-full text-left py-2 text-navy-800 hover:text-gas-orange-500 font-bold text-sm cursor-pointer"
                  id={`mobile-nav-link-${idx}`}
                >
                  {label}
                </button>
              );
            })}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-50">
              <a
                href="tel:+27821234567"
                className="bg-navy-100 hover:bg-navy-200 text-navy-950 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-gas-orange-500" />
                <span>Call Hotline</span>
              </a>
              <a
                href="https://wa.me/27821234567"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* --- HOMEPAGE HERO SECTION --- */}
      <section 
        className="relative bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-white py-16 md:py-24 px-4 overflow-hidden border-b-4 border-gas-orange-500"
        id="hero-home"
      >
        {/* Abstract glowing visual background lines */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gas-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text copy column 1 */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-gas-orange-500/25 text-gas-orange-200 border border-gas-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Truck className="w-3.5 h-3.5 text-gas-orange-400 animate-pulse" />
              <span>Free Delivery on 3+ Bottles Ordered</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white">
                Fast & Reliable <span className="text-gas-orange-500 underline decoration-wavy underline-offset-8">Gas Delivery</span> to Your Home
              </h1>
              <p className="text-navy-200 text-sm md:text-base max-w-2xl leading-relaxed">
                Refilling empty LPG cylinders shouldn't be a hassle. We deliver premium, safety-certified gas cylinders straight to your doorstep in Pretoria, Centurion, Midrand and surroundings. Return your empty cylinder of any brand to skip the deposit fee and pay only for the gas refill!
              </p>
            </div>

            {/* Micro Highlights of service */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-xl">
              {[
                { title: 'LPGSA Safety Certified', desc: 'Protected Valves' },
                { title: 'Best Local Rands', desc: 'No Hidden Spikes' },
                { title: 'Same/Next Day', desc: 'Guaranteed Dispatch' }
              ].map((h, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="block text-xs font-bold text-gas-orange-400 font-display">{h.title}</span>
                  <span className="block text-[10px] text-navy-300 font-mono mt-0.5">{h.desc}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => scrollToSection('catalog-section')}
                className="bg-gas-orange-500 hover:bg-gas-orange-600 active:bg-gas-orange-700 text-white font-display font-black text-sm px-8 py-4.5 rounded-2xl transition-all shadow-lg shadow-gas-orange-500/20 active:scale-95 text-center cursor-pointer"
                id="hero-order-now-btn"
              >
                Order Gas Now
              </button>

              <a
                href="https://wa.me/27821234567?text=Hi!%20I%20would%20like%20to%20order%20LPG%20gas%20refill%20delivered%20today."
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white font-display font-bold text-sm px-8 py-4.5 rounded-2xl transition-all flex items-center justify-center gap-2"
                id="hero-whatsapp-btn"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 fill-current" />
                <span>WhatsApp Dispatch</span>
              </a>
            </div>
          </div>

          {/* Interactive Three.js cylinder mockup hero column 2 */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gas-orange-500 to-navy-500 opacity-20 blur-xl"></div>
            <div className="w-full max-w-[380px] h-[380px] sm:h-[420px] bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl relative flex flex-col justify-between">
              
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gas-orange-400 block font-bold">Sinoville Cylinder Labs</span>
                <span className="text-sm font-semibold text-white mt-1 block">9kg LPG Classic</span>
              </div>
              
              <div className="absolute top-4 right-4 z-10 bg-emerald-500 text-white rounded-full p-1 border border-white/30" title="Safety certified stamp">
                <ShieldCheck className="w-4 h-4" />
              </div>

              {/* Mounted interactive canvas */}
              <div className="flex-1 w-full h-full relative" id="hero-rendering-shell">
                <div className="absolute inset-0 z-0">
                  <Cylinder3D 
                    color="#0B2545" 
                    sizeScale={1.0} 
                    heightScale={1.0} 
                    isRotating={true} 
                  />
                </div>
              </div>

              {/* Quick instructions for the 3D element */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-navy-300 font-mono">
                <span>🟢 Sealed Safety valve</span>
                <span className="text-gas-orange-400 animate-pulse">Drag model left or right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SINOVILLE WHY CHOOSE US SECTION --- */}
      <section className="py-16 bg-white border-b border-navy-100" id="why-us-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">TRUSTED LPG CARRIERS</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Safe, Hassle-Free Cooking & Winter Warmth Gas
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed">
              We focus on absolute safety, certified accurate cylinder filling weights, and courteous local service in South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Affordable Rates',
                desc: 'Highly competitive local Rand pricing with clear deposit rules. Return an empty to save big.',
                icon: <Award className="w-6 h-6 text-gas-orange-500" />
              },
              {
                title: 'Certified Cylinders',
                desc: 'Every LPG bottle undergoes high-pressure safety testing and carries the LPGSA protective seal.',
                icon: <ShieldCheck className="w-6 h-6 text-navy-900" />
              },
              {
                title: 'Fast Dispatch',
                desc: 'Immediate dispatch tracking. Pretoria & Centurion orders before 12:00 PM are delivered same day.',
                icon: <Clock className="w-6 h-6 text-gas-orange-500" />
              },
              {
                title: 'Friendly Local Team',
                desc: 'Sinoville is proudly family-owned. We assist in carrying, connecting, and checking for leaks.',
                icon: <MessageSquare className="w-6 h-6 text-navy-900" />
              },
              {
                title: 'Safe Weight Fills',
                desc: 'We weigh our bottles before transport to ensure you receive 100% of the gas you buy.',
                icon: <CheckCircle2 className="w-6 h-6 text-gas-orange-500" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-navy-50/50 rounded-2xl p-5 border border-navy-100/40 relative hover:-translate-y-1 transition-all h-full group"
                id={`why-us-card-${idx}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white text-navy-900 flex items-center justify-center shadow-xs border border-navy-100 mb-4 group-hover:bg-gas-orange-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="font-display font-bold text-navy-900 text-sm md:text-base mb-2 group-hover:text-gas-orange-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-navy-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Safety alert panel block inside Why Us */}
          <div className="bg-amber-50/70 border border-amber-100 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-12 max-w-4xl mx-auto">
            <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h5 className="font-bold text-xs text-amber-950 uppercase tracking-wide">⚠️ LPG Gas Safety Rule for households:</h5>
              <p className="text-xs text-amber-900 leading-normal mt-1">
                Always hook your LPG cylinder in an upright vertical position. Keep cylinders away from direct heat sources and electrical outlets. If you ever perceive a gas leak (smell of rotten eggs), immediately close the cylinder valve and open windows.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- CYLINDER EXCHANGE CALCULATOR SIMULATOR --- */}
      <section className="py-16 bg-navy-50/30 border-b border-navy-100" id="calculator-section">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">TRANSFORM & TRADE-IN</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Interactive Cylinder Swapping Station
            </h2>
            <p className="text-sm text-navy-500 max-w-2xl mx-auto leading-relaxed">
              Don't lose money on your empty bottle deposit. Mix and match any South African cylinder sizes below to see your immediate credit adjustments.
            </p>
          </div>

          <ExchangeCalculator 
            onAddExchangeToCart={(product, qty, type) => {
              handleAddToCart(product, qty, type);
              setIsCartOpen(true);
            }} 
          />

        </div>
      </section>

      {/* --- CYLINDER CATALOG SECTION --- */}
      <section className="py-16 bg-white border-b border-navy-100 scroll-mt-20" id="catalog-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div className="text-left space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">LPG CYLINDER CATALOG</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
                Select Your Required Cylinder Spec
              </h2>
              <p className="text-sm text-navy-500">
                Choose custom sized tanks from 5kg camping units to 48kg heavy commercial cylinders. Click the 3D toggle on any card for full interactive view!
              </p>
            </div>
            
            {/* Direct Quick filter tabs */}
            <div className="bg-navy-50 p-1 rounded-2xl border border-navy-100 text-xs font-mono flex gap-1 font-bold">
              <span className="bg-navy-900 text-white px-3 py-1.5 rounded-xl">All Sizes Standard</span>
              <span className="text-navy-500 px-3 py-1.5">99.9% Commercial Propane</span>
            </div>
          </div>

          {/* Active Checkout Overlay trigger alert if showCheckout is true */}
          {showCheckout && (
            <div className="mb-10 p-4 bg-gas-orange-500 text-white rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 animate-bounce" />
                <div className="text-left">
                  <span className="font-bold text-sm block">Checkout Active:</span>
                  <p className="text-xs opacity-90">Please fill out your delivery details to confirm your gas order dispatch.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCheckout(false)}
                className="bg-navy-950/20 hover:bg-navy-950/40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                id="back-to-catalog-btn"
              >
                Back to Catalog View
              </button>
            </div>
          )}

          {showCheckout ? (
            <div className="max-w-5xl mx-auto" id="checkout-form-rendering-grid">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Checkout formulation left side */}
                <div className="lg:col-span-8">
                  <CheckoutForm 
                    cartItems={cartItems} 
                    selectedArea={selectedArea} 
                    onClearCart={handleClearCart}
                    onClose={() => setShowCheckout(false)}
                  />
                </div>

                {/* Sticky Order recap right side */}
                <div className="lg:col-span-4 bg-navy-900 text-white p-6 rounded-3xl border border-navy-850 space-y-5 sticky top-28">
                  <h4 className="font-display font-extrabold text-lg text-white pb-3 border-b border-white/10 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gas-orange-500" />
                    <span>Order Invoice Recap</span>
                  </h4>
                  <div className="space-y-3 text-xs text-navy-200">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start pt-2 border-b border-navy-800/60 pb-2">
                        <div>
                          <p className="font-bold text-white">{item.product.size}</p>
                          <p className="text-[10px] text-navy-400">
                            {item.type === 'exchange' ? '🔄 Refill Swap' : '📦 Deposit + Gas'} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-white">
                          R{(item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location Area info */}
                  <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-navy-400 uppercase">SHIPPING AREA:</span>
                    <p className="text-xs font-bold text-white uppercase">{selectedArea?.name || 'Pretoria/Centurion'}</p>
                    <p className="text-[10px] text-navy-300 leading-snug">{selectedArea?.deliveryTime}</p>
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between text-navy-300">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold text-white">R{cartItems.reduce((acc, item) => acc + (item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice) * item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-navy-300">
                      <span>Delivery Service Fee:</span>
                      <span className="font-mono font-semibold text-white">{isFreeDelivery ? 'FREE' : `R${activeDeliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/10">
                      <span>Grand Total Dued:</span>
                      <span className="font-mono text-gas-orange-400">R{(cartItems.reduce((acc, item) => acc + (item.type === 'exchange' ? item.product.refillPrice : item.product.newPrice) * item.quantity, 0) + activeDeliveryFee).toLocaleString('en-ZA')}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Cylinder grid display cards list */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {CYLINDERS.map((cur) => (
                <CylinderCard 
                  key={cur.id} 
                  product={cur} 
                  onAddToCart={(p, q, t) => {
                    handleAddToCart(p, q, t);
                  }} 
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* --- SERVICE AREAS SECTION --- */}
      <section className="py-16 bg-navy-50/20 border-b border-navy-100" id="areas-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">OUR FLEET REACH</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Rapid Delivery Across Gauteng Province
            </h2>
            <p className="text-sm text-navy-500">
              We operate dedicated local delivery trucks. Pretoria and Centurion receive maximum frequency same-day drops.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column Area Specs lists */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICE_AREAS.map((area, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 bg-white rounded-2xl border border-navy-100 hover:border-gas-orange-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-extrabold text-navy-900 text-base flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gas-orange-500" />
                          <span>{area.name}</span>
                        </h4>
                        <span className="font-mono text-xs text-navy-500 font-bold bg-navy-50 px-2.5 py-0.5 rounded-md">
                          R{area.deliveryFee} fee
                        </span>
                      </div>
                      <p className="text-xs text-navy-500 leading-normal mb-4">
                        {area.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-100 flex items-center gap-1.5 w-fit mt-auto">
                      <Truck className="w-3.5 h-3.5 animate-bounce" />
                      <span>{area.deliveryTime}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Disclaimer statement box */}
              <div className="p-4.5 bg-navy-900 text-white rounded-2xl border border-navy-800 space-y-1.5">
                <h5 className="text-xs font-bold text-gas-orange-500 uppercase tracking-widest">ℹ️ SAME-DAY TRUCK DISPATCH RULES:</h5>
                <p className="text-xs text-navy-300 leading-relaxed">
                  Orders for Pretoria or Centurion must be placed before 11:00 AM on weekdays or 10:00 AM on Saturdays to qualify for same-day delivery. All other cities (Midrand, Jhb, Sandton) follow guaranteed next-day dispatch routing.
                </p>
              </div>
            </div>

            {/* Right Column Abstract vector map of operations SA */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-navy-100 text-center space-y-4">
              <span className="text-[10px] font-mono font-bold text-gas-orange-500 block uppercase tracking-widest">ZA GAUTENG COVERAGE RADAR</span>
              
              {/* Graphic custom SVG representing Pretoria & Joburg coordinates */}
              <div className="bg-navy-50 aspect-square max-w-[320px] mx-auto rounded-full border border-navy-100 relative flex items-center justify-center p-3">
                
                {/* Visual coordinate target radar grids */}
                <div className="absolute inset-4 rounded-full border border-dashed border-navy-200"></div>
                <div className="absolute inset-16 rounded-full border border-dashed border-navy-200"></div>
                
                {/* Glowing Pretoria focal point */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
                  <span className="w-4 h-4 rounded-full bg-gas-orange-500 absolute -top-1 -left-1 opacity-75 animate-ping"></span>
                  <div className="w-2.5 h-2.5 rounded-full bg-gas-orange-600 border border-white relative"></div>
                  <span className="text-[10px] font-bold text-navy-900 font-display block mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Pretoria Hub</span>
                </div>

                {/* Centurion focal point */}
                <div className="absolute top-[45%] left-[45%] text-center z-10">
                  <div className="w-2 h-2 rounded-full bg-navy-900 border border-white"></div>
                  <span className="text-[9px] font-bold text-navy-800 font-display block mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Centurion</span>
                </div>

                {/* Midrand focal point */}
                <div className="absolute top-[58%] left-[52%] text-center z-10">
                  <div className="w-2 h-2 rounded-full bg-navy-900 border border-white"></div>
                  <span className="text-[9px] font-bold text-navy-800 font-display block mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Midrand</span>
                </div>

                {/* Jhb Sandton focal point */}
                <div className="absolute top-[75%] left-[40%] text-center z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-gas-orange-500 border border-white"></div>
                  <span className="text-[10px] font-mono font-extrabold text-navy-950 block mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">JHB / Sandton</span>
                </div>

                {/* Connection lines vector */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" fill="none">
                  <path d="M50,30 L45,47 L52,60 L40,77" stroke="#0B2545" strokeWidth="0.75" strokeDasharray="3,3" />
                </svg>

                <div className="absolute bottom-4 inset-x-4 bg-navy-900 text-white rounded-xl p-2.5 text-[10px] text-center font-mono">
                  🚨 Delivery Truck Radius Online
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-navy-950 font-display">Don't check your area listed?</p>
                <p className="text-[11px] text-navy-500 leading-normal">
                  If you reside in near Gauteng suburbs or commercial blocks, WhatsApp us! We often schedule bulk deliveries further on query.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- CUSTOMER REVIEWS TESTIMONIALS SECTION --- */}
      <section className="py-16 bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">SINOVILLE SATISFACTION</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Honest Feedback From Our South African Community
            </h2>
            <p className="text-sm text-navy-500">
              Hear directly why over 1,500 active households and commercial restaurants count on our gas bottle distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r) => (
              <div 
                key={r.id} 
                className="bg-navy-50/20 p-5 rounded-2xl border border-navy-100 flex flex-col justify-between"
                id={`customer-review-${r.id}`}
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-3" title={`${r.rating} stars rating`}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-navy-200'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-xs text-navy-700 leading-relaxed italic mb-4 min-h-[90px]">
                    "{r.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-navy-100/60 mt-auto">
                  {/* Letter Avatar */}
                  <div className="w-9 h-9 rounded-full bg-navy-900 text-white font-display font-extrabold text-sm flex items-center justify-center">
                    {r.avatarLetter}
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-navy-950 truncate">{r.name}</h5>
                    <span className="text-[10px] text-navy-400 block">{r.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- FAQS ACCORDION SECTION --- */}
      <section className="py-16 bg-navy-50/10 border-b border-navy-100" id="faqs-section">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">ANSWERS ON DEMAND</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Gas Cylinder Frequently Asked Questions
            </h2>
            <p className="text-sm text-navy-500">
              Clear information on the CADAC safety specifications, LPG standard filling weights, and local shipping operations.
            </p>
          </div>

          <div className="space-y-3.5" id="faqs-accordion-wrapper">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-navy-150 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4.5 flex items-center justify-between gap-4 font-display font-bold text-sm text-navy-900 hover:text-gas-orange-500 transition-colors cursor-pointer"
                    id={`faq-btn-trigger-${idx}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-mono bg-gas-orange-50 text-gas-orange-600 px-2 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-gas-orange-500' : 'text-navy-400'}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-navy-600 border-t border-navy-50 leading-relaxed bg-navy-50/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- CONTACT & RESERVATION SECTION --- */}
      <section className="py-16 bg-white border-b border-navy-100" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-gas-orange-500 uppercase leading-none block">TALK TO US</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-navy-900 tracking-tight">
              Get In Touch With Gas Supplying Pros
            </h2>
            <p className="text-sm text-navy-500">
              Inquire about residential gas contracts, restaurant bulk supply discount, or immediate safety guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column Quick Detail links & icons */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 bg-navy-900 text-white rounded-3xl border border-navy-800 space-y-5">
                <h4 className="font-display font-black text-lg text-white">Our Business Office</h4>
                <p className="text-xs text-navy-300 leading-relaxed">
                  Have a question or prefer placing order via cellular calls? Reach our dispatch office directly.
                </p>

                <div className="space-y-4 text-xs font-mono text-navy-200">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gas-orange-500 shrink-0" />
                    <div className="text-left">
                      <strong className="block text-white">Phone hotline:</strong>
                      <a href="tel:+27821234567" className="hover:text-white transition-colors">+27 82 123 4567</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* SVG representation of WhatsApp logo */}
                    <div className="w-5 h-5 text-emerald-500 shrink-0">
                      <MessageSquare className="w-5 h-5 fill-current text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <strong className="block text-white">WhatsApp chat:</strong>
                      <a href="https://wa.me/27821234567" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">+27 82 123 4567</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gas-orange-500 shrink-0" />
                    <div className="text-left">
                      <strong className="block text-white">Depot address:</strong>
                      <span>Plot 14, Main Road, Sinoville, Pretoria, 0182</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/27821234567"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Click to WhatsApp Us</span>
                  </a>
                </div>
              </div>

              {/* Business operating hours */}
              <div className="p-5 bg-navy-50 rounded-2xl border border-navy-100 text-xs text-navy-700 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gas-orange-500" />
                  <strong className="font-bold text-navy-950 uppercase font-display text-xs">Sinoville Depot Hours:</strong>
                </div>
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between border-b border-navy-100 pb-1">
                    <span>Monday - Friday:</span>
                    <span>07:30 - 17:00</span>
                  </div>
                  <div className="flex justify-between border-b border-navy-100 pb-1">
                    <span>Saturday:</span>
                    <span>08:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday & Holidays:</span>
                    <span className="text-rose-600 font-bold">Closed (Emergency only)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column Custom Contact Form */}
            <div className="lg:col-span-8 bg-navy-50/50 p-6 md:p-8 rounded-3xl border border-navy-100">
              
              {contactSubmitted ? (
                <div className="text-center py-10 space-y-4" id="contact-success-screen">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-xl text-navy-900">Message Dispatched Successfully!</h4>
                  <p className="text-xs text-navy-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for your interest! A friendly Sinoville Gas sales manager will call or message your phone number shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-mono font-bold text-navy-600 uppercase">Your Name / Business:</label>
                      <input 
                        type="text" 
                        required 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Sandra Baker"
                        className="w-full bg-white border border-navy-200 rounded-xl px-4 py-3 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500"
                        id="contact-form-name"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-mono font-bold text-navy-600 uppercase">Your Mobile Phone:</label>
                      <input 
                        type="tel" 
                        required 
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. 082 123 4567"
                        className="w-full bg-white border border-navy-200 rounded-xl px-4 py-3 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500"
                        id="contact-form-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono font-bold text-navy-600 uppercase">Your Query Details:</label>
                    <textarea 
                      rows={4} 
                      required 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="e.g. Good day, please provide quotation for supplying five 19kg gas cylinders weekly for our restaurant kitchen in Centurion."
                      className="w-full bg-white border border-navy-200 rounded-xl px-4 py-3 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gas-orange-500 resize-none"
                      id="contact-form-msg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-navy-900 hover:bg-navy-800 text-white font-display font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    id="contact-form-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="bg-navy-950 text-white py-12 px-4 border-t-2 border-navy-800" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Info */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gas-orange-500 text-white flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <span className="font-display font-black text-base tracking-tight text-white block">
                SINOVILLE <span className="text-gas-orange-500">GAS</span>
              </span>
            </div>
            <p className="text-xs text-navy-400 leading-normal max-w-xs">
              Providing safe, high quality certified LPG cylinder refills and exchange options to Gauteng province houses and commercial food caterers.
            </p>
            <div className="text-[10px] text-navy-500">
              Approved LPGSA LP-Gas Practitioner License #LP9201a
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3 text-left">
            <h5 className="text-xs font-bold text-gas-orange-500 uppercase tracking-widest">Our Operations</h5>
            <ul className="text-xs text-navy-300 space-y-2 font-medium">
              <li>
                <button onClick={() => scrollToSection('catalog-section')} className="hover:text-white transition-colors cursor-pointer">
                  Cylinder Size Catalog
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('calculator-section')} className="hover:text-white transition-colors cursor-pointer">
                  Exchange Calculator
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('areas-section')} className="hover:text-white transition-colors cursor-pointer">
                  Suburbs Service Maps
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / safety */}
          <div className="space-y-3 text-left">
            <h5 className="text-xs font-bold text-gas-orange-500 uppercase tracking-widest">Safety Assured</h5>
            <ul className="text-xs text-navy-300 space-y-2">
              <li>LPGSA Certified Seals Only</li>
              <li>Double-checked Empty Tare Weight</li>
              <li>Pressure Verified Valves</li>
              <li>Prompt Local Drivers Checkups</li>
            </ul>
          </div>

          {/* Working schedule newsletter info */}
          <div className="space-y-4 text-left">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest">Sino Gas Dispatch</h5>
            <p className="text-xs text-navy-400">
              For rapid assistance or immediate quotations, please launch direct WhatsApp chat or call Pretoria central office.
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-xs font-mono font-bold text-emerald-400">✅ WhatsApp Dispatch Hub Online</span>
            </div>
          </div>

        </div>

        {/* Sub copyright and terms rules */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-navy-500">
          <p>© 2026 Sinoville Gas Express & Cylinder Exchange Pty Ltd. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">LPG Safety Act SANS 10087-1</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>

      {/* --- CART DRAWER OVERLAY --- */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setShowCheckout(true);
          scrollToSection('catalog-section');
        }}
      />

    </div>
  );
}
