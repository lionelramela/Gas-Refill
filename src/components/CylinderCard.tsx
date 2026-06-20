import React, { useState } from 'react';
import { CylinderProduct } from '../types';
import Cylinder3D from './Cylinder3D';
import { ShoppingCart, HelpCircle, Weight, Compass, Flame, Check, Sparkles } from 'lucide-react';

interface CylinderCardProps {
  key?: string;
  product: CylinderProduct;
  onAddToCart: (product: CylinderProduct, quantity: number, type: 'exchange' | 'new') => void;
}

export default function CylinderCard({ product, onAddToCart }: CylinderCardProps) {
  const [purchaseType, setPurchaseType] = useState<'exchange' | 'new'>('exchange');
  const [quantity, setQuantity] = useState<number>(1);
  const [view3D, setView3D] = useState<boolean>(false);
  const [addedTemp, setAddedTemp] = useState<boolean>(false);

  const price = purchaseType === 'exchange' ? product.refillPrice : product.newPrice;

  // Compute height and radii scaling factor relative to 9kg (which is 1.0)
  // sizes: 5kg, 9kg, 14kg, 19kg, 48kg
  let sizeScale = 1.0;
  let heightScale = 1.0;

  if (product.sizeNum === 5) {
    sizeScale = 0.8;
    heightScale = 0.7;
  } else if (product.sizeNum === 9) {
    sizeScale = 1.0;
    heightScale = 1.0;
  } else if (product.sizeNum === 14) {
    sizeScale = 1.1;
    heightScale = 1.25;
  } else if (product.sizeNum === 19) {
    sizeScale = 1.15;
    heightScale = 1.5;
  } else if (product.sizeNum === 48) {
    sizeScale = 1.35;
    heightScale = 2.0;
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity, purchaseType);
    setAddedTemp(true);
    setTimeout(() => setAddedTemp(false), 2000);
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-navy-100 flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all h-full group"
      id={`cylinder-card-${product.id}`}
    >
      {/* Card Header Media area */}
      <div className="relative h-60 bg-gradient-to-b from-navy-50 to-white flex items-center justify-center p-4 overflow-hidden border-b border-navy-100/50">
        
        {view3D ? (
          <div className="w-full h-full relative" id={`mesh-container-3d-${product.id}`}>
            <Cylinder3D 
              color={product.color} 
              sizeScale={sizeScale} 
              heightScale={heightScale}
              isRotating={true}
            />
          </div>
        ) : (
          /* SVG Premium Mockup graphic */
          <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
            {/* Visual ambient rings */}
            <div className="absolute w-36 h-36 rounded-full bg-navy-100/40 animate-pulse-slow"></div>
            
            {/* Cylinder Vector Drawing */}
            <svg 
              className="w-32 h-44 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              viewBox="0 0 100 130" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={product.color} />
                  <stop offset="35%" stopColor={product.color} stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor={product.color} />
                </linearGradient>
                <radialGradient id={`shadow-${product.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="50" cy="120" rx="35" ry="8" fill={`url(#shadow-${product.id})`} />

              {/* Cylinder Guard collar top */}
              <rect x="35" y="15" width="30" height="15" rx="2" fill={product.color} opacity="0.9" />
              <rect x="40" y="20" width="20" height="4" rx="1" fill="#ffffff" opacity="0.4" />

              {/* Cylinder Brass Valve assembly */}
              <rect x="46" y="23" width="8" height="10" fill="#cca352" />
              <circle cx="50" cy="23" r="6" fill="#cca352" />
              <rect x="42" y="18" width="16" height="3" fill="#ff4400" />

              {/* Cylinder main body */}
              <rect x="22" y="40" width="56" height="70" rx="14" fill={`url(#grad-${product.id})`} />
              
              {/* Highlight Overlay */}
              <rect x="22" y="40" width="12" height="70" rx="1" fill="#ffffff" opacity="0.12" />

              {/* Welded center band */}
              <rect x="20" y="74" width="60" height="3" fill="#8894a3" opacity="0.6" />

              {/* Safety Sticker Label */}
              <rect x="32" y="55" width="36" height="24" rx="2" fill="white" />
              <rect x="35" y="58" width="30" height="2" fill="#0B2545" />
              {/* Little SA Flag concept colors */}
              <rect x="35" y="63" width="30" height="4" fill={product.color} />
              <text x="50" y="74" fill={product.color} fontSize="6" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                {product.sizeNum}KG LPG
              </text>

              {/* Base support stand */}
              <rect x="28" y="108" width="44" height="6" rx="1" fill="#495057" />
            </svg>
          </div>
        )}

        {/* 3D Switch Action */}
        <button
          onClick={() => setView3D(!view3D)}
          className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-display font-bold shadow-sm border cursor-pointer transition-all flex items-center gap-1.5 z-10 ${
            view3D 
              ? 'bg-gas-orange-500 text-white border-gas-orange-600' 
              : 'bg-white/90 text-navy-800 border-navy-100 hover:bg-white'
          }`}
          id={`toggle-3d-view-${product.id}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{view3D ? 'Show 2D Illustration' : 'Interactive 3D View'}</span>
        </button>

        {/* Availability Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs ${
          product.availability === 'In Stock'
            ? 'bg-emerald-100 text-emerald-800'
            : product.availability === 'Low Stock'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-rose-100 text-rose-800'
        }`}>
          ● {product.availability}
        </span>
      </div>

      {/* Product Content Specifications */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-display font-black text-xl text-navy-900 group-hover:text-gas-orange-600 transition-colors">
              {product.size}
            </h4>
            <span className="text-[10px] bg-navy-50 text-navy-700 px-2 py-0.5 rounded-md font-mono font-medium">
              LPG Standard
            </span>
          </div>

          <p className="text-xs text-navy-500 leading-relaxed mb-4 min-h-[40px]">
            {product.bestFor}
          </p>

          {/* Quick Specifications list */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-navy-50/50 rounded-2xl text-[11px] text-navy-700 font-medium mb-5 border border-navy-50/50">
            <div className="flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5 text-navy-400 shrink-0" />
              <span className="truncate">{product.weightEmpty}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-navy-400 shrink-0" />
              <span className="truncate">{product.dimensions.split(' ')[0]} h</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 text-navy-600">
              <Flame className="w-3.5 h-3.5 text-gas-orange-500 shrink-0 animate-pulse" />
              <span>Certified LPGSA Valve Seal Approved</span>
            </div>
          </div>

          {/* Core Pricing Strategy Toggler */}
          <div className="space-y-2 mb-5">
            <span className="block text-[10px] font-mono font-bold tracking-wider text-navy-400 uppercase">
              SELECT RENTAL TYPE:
            </span>
            <div className="grid grid-cols-2 gap-1 bg-navy-50 p-1 rounded-2xl border border-navy-100/50">
              <button
                type="button"
                onClick={() => setPurchaseType('exchange')}
                className={`py-2 px-1 text-center rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                  purchaseType === 'exchange'
                    ? 'bg-white text-navy-900 shadow-sm border border-navy-100/30'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
                id={`btn-toggle-exchange-${product.id}`}
              >
                Cylinder Exchange
                <span className="block text-[9px] font-normal text-navy-400">Own empty bottle</span>
              </button>
              <button
                type="button"
                onClick={() => setPurchaseType('new')}
                className={`py-2 px-1 text-center rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                  purchaseType === 'new'
                    ? 'bg-white text-navy-900 shadow-sm border border-navy-100/30'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
                id={`btn-toggle-new-${product.id}`}
              >
                New Bottle Combo
                <span className="block text-[9px] font-normal text-navy-400">Gas + Deposit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Control area: Price & Add to Cart button */}
        <div className="pt-4 border-t border-navy-50 mt-auto">
          {/* Detailed Pricing summary */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-navy-400 block tracking-tight uppercase">
                {purchaseType === 'exchange' ? 'Refill Price' : 'New Bundle Price'}
              </span>
              <div className="flex items-baseline text-navy-900 group-hover:scale-105 transition-transform origin-left">
                <span className="font-extrabold text-sm text-gas-orange-500">R</span>
                <span className="font-display font-black text-2xl md:text-3xl leading-none">
                  {price}
                </span>
                {purchaseType === 'new' && (
                  <span className="text-[9px] text-navy-400 font-mono ml-1">
                    [R{product.refillPrice} gas + R{product.depositPrice} dep]
                  </span>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center bg-navy-50/80 rounded-xl overflow-hidden border border-navy-100 text-xs shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1.5 hover:bg-navy-100 text-navy-600 font-black transition-colors"
                id={`btn-card-minus-${product.id}`}
              >
                -
              </button>
              <span className="px-3 py-1.5 font-mono font-bold text-navy-800 bg-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1.5 hover:bg-navy-100 text-navy-600 font-black transition-colors"
                id={`btn-card-plus-${product.id}`}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.availability === 'Out of Stock'}
            className={`w-full font-display font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              product.availability === 'Out of Stock'
                ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                : addedTemp
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-navy-900 hover:bg-navy-800 active:bg-navy-950 text-white active:scale-[0.98]'
            }`}
            id={`btn-add-to-cart-${product.id}`}
          >
            {addedTemp ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{purchaseType === 'exchange' ? 'Add Exchange Refill' : 'Order Gas + Cylinder'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
