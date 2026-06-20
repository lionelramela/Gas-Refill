import { CylinderProduct, ServiceArea, Review, FAQ } from './types';

export const CYLINDERS: CylinderProduct[] = [
  {
    id: 'lpg-5kg',
    size: '5kg Cylinder',
    sizeNum: 5,
    refillPrice: 155,
    newPrice: 605, // gas + R450 deposit
    depositPrice: 450,
    availability: 'In Stock',
    bestFor: 'Camping, CADAC stoves, compact gas heaters & small patio braais',
    dimensions: '320mm Height × 250mm Diameter',
    weightEmpty: '5.2kg (Total full weight ~10.2kg)',
    gasType: 'LPG Gas (Certified Commercial Grade)',
    color: '#344e41' // Forest green styled cylinder
  },
  {
    id: 'lpg-9kg',
    size: '9kg Cylinder',
    sizeNum: 9,
    refillPrice: 275,
    newPrice: 875, // gas + R600 deposit
    depositPrice: 600,
    availability: 'In Stock',
    bestFor: 'Most popular home gas heaters, conventional gas hobs, & standard gas braais',
    dimensions: '460mm Height × 300mm Diameter',
    weightEmpty: '8.6kg (Total full weight ~17.6kg)',
    gasType: 'LPG Gas (Certified Commercial Grade)',
    color: '#0B2545' // Deep Navy Blue cylinder
  },
  {
    id: 'lpg-14kg',
    size: '14kg Cylinder',
    sizeNum: 14,
    refillPrice: 425,
    newPrice: 1175, // gas + R750 deposit
    depositPrice: 750,
    availability: 'Low Stock',
    bestFor: 'Continuous winter gas heating, busy family kitchens & high-use hobs',
    dimensions: '580mm Height × 305mm Diameter',
    weightEmpty: '12.4kg (Total full weight ~26.4kg)',
    gasType: 'LPG Gas (Certified Commercial Grade)',
    color: '#d66800' // High-Visibility Orange cylinder
  },
  {
    id: 'lpg-19kg',
    size: '19kg Cylinder',
    sizeNum: 19,
    refillPrice: 580,
    newPrice: 1480, // gas + R900 deposit
    depositPrice: 900,
    availability: 'In Stock',
    bestFor: 'Large households with extensive gas lines, restaurant hobs, and warehouse space heaters',
    dimensions: '750mm Height × 310mm Diameter',
    weightEmpty: '16.5kg (Total full weight ~35.5kg)',
    gasType: 'LPG Gas (Certified Commercial Grade)',
    color: '#495057' // Slate Charcoal cylinder
  },
  {
    id: 'lpg-48kg',
    size: '48kg Cylinder',
    sizeNum: 48,
    refillPrice: 1470,
    newPrice: 3270, // gas + R1800 deposit
    depositPrice: 1800,
    availability: 'In Stock',
    bestFor: 'Heavy commercial restaurant kitchens, continuous central home heating & industrial processes',
    dimensions: '1250mm Height × 375mm Diameter',
    weightEmpty: '38.0kg (Total full weight ~86.0kg)',
    gasType: 'LPG Gas (Certified Commercial Grade)',
    color: '#bf0603' // Industrial Safety Red cylinder
  }
];

export const SERVICE_AREAS: ServiceArea[] = [
  {
    name: 'Pretoria',
    deliveryFee: 65,
    description: 'All central, east, north, and southern suburbs.',
    deliveryTime: 'Same-day delivery (for orders before 11:00 AM)'
  },
  {
    name: 'Centurion',
    deliveryFee: 65,
    description: 'All residential and business sectors.',
    deliveryTime: 'Same-day delivery (for orders before 12:00 PM)'
  },
  {
    name: 'Midrand',
    deliveryFee: 75,
    description: 'Suburbs including Waterfall, Kyalami, Carlswald.',
    deliveryTime: 'Next-day delivery guaranteed'
  },
  {
    name: 'Johannesburg',
    deliveryFee: 85,
    description: 'Northern & Central Johannesburg.',
    deliveryTime: 'Scheduled next-day delivery'
  },
  {
    name: 'Sandton',
    deliveryFee: 85,
    description: 'Suburbs including Bryanston, Fourways, Rivonia.',
    deliveryTime: 'Scheduled next-day delivery'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Hendrik van der Merwe',
    location: 'Garsfontein, Pretoria',
    rating: 5,
    comment: 'Absolutely spectacular service! I ordered a 9kg refill at 9 AM and a fully sanitized cylinder was delivered to my house by 1 PM. The driver even helped connect it to my patio heater and checked for leaks with soap water. Excellent focus on safety!',
    date: '2026-05-18',
    verified: true,
    avatarLetter: 'H'
  },
  {
    id: 'rev-2',
    name: 'Lerato Mokwena',
    location: 'Midstream Estate, Centurion',
    rating: 5,
    comment: 'Great value and so simple to order through the website. They gave me a WhatsApp tracking link when they were on their way. Seamless bottle exchange process, highly recommended!',
    date: '2026-06-02',
    verified: true,
    avatarLetter: 'L'
  },
  {
    id: 'rev-3',
    name: 'Sipho Ndlovu',
    location: 'Sunninghill, Sandton',
    rating: 5,
    comment: 'Very professional. The cylinders are in excellent brand new condition, and they always carry a certified safety seal round the valve. Rands are affordable compared to depot prices!',
    date: '2026-06-12',
    verified: true,
    avatarLetter: 'S'
  },
  {
    id: 'rev-4',
    name: 'Claire du Toit',
    location: 'Moreleta Park, Pretoria',
    rating: 4,
    comment: 'Reliable and friendly. They called me 15 minutes before arrival to prompt me to unlock the gate. Love supporting South African local SMEs!',
    date: '2026-06-15',
    verified: true,
    avatarLetter: 'C'
  }
];

export const FAQS: FAQ[] = [
  {
    category: 'Exchange Process',
    question: 'How does the Cylinder Exchange work?',
    answer: 'It\'s simple! When placing an order, select "Exchange Cylinder" if you already own an empty LPG gas cylinder of the same size. When our delivery crew arrives, they collect your empty cylinder and replace it with a certified, fully filled, safety-sealed cylinder. You only pay the lower "Refill/Exchange" price!'
  },
  {
    category: 'Exchange Process',
    question: 'What empty cylinders do you accept for exchange?',
    answer: 'We accept all standard South African LPG cylinders (e.g., TotalGas, Easigas, Oryx, Afrox, Cadac) of equivalent size. The cylinder must be in a reusable condition with its valve intact. If you don\'t have a cylinder to exchange, simply select "No Cylinder (New Purchase)" and a one-off cylinder deposit fee will be added to your order.'
  },
  {
    category: 'Delivery & Areas',
    question: 'What are your delivery times and schedules?',
    answer: 'For Pretoria and Centurion, orders placed before 11:00 AM qualify for same-day delivery. All other areas (Midrand, Johannesburg, Sandton) are scheduled for next-day delivery. We operate Monday to Saturday, from 07:30 to 17:00.'
  },
  {
    category: 'Safety & Quality',
    question: 'Are your gas cylinders safe and certified?',
    answer: 'Yes, 100%! All of our cylinders are pressurized, tested, and certified by LPGSA standards. Each full cylinder has a branded shrink-wrap safety seal on the valve to guarantee correct weight and unadulterated premium commercial grade LPG. Our delivery drivers are fully trained to inspect valves and conduct leak checks upon installation.'
  },
  {
    category: 'Payment Methods',
    question: 'How do I pay for my order?',
    answer: 'To assist our customers and ensure security, we offer flexible payment methods: (1) Cash on delivery, (2) Speedpoint debit/credit card swipe on delivery, or (3) Instant EFT payment upon order. You can indicate your preference in the checkout box!'
  },
  {
    category: 'Emergency',
    question: 'What should I do if I suspect a gas leak?',
    answer: 'First, close the cylinder valve by turning the handwheel clockwise. Extinguish any open flames, ventilate the area immediately by opening doors and windows, and DO NOT turn on/off any electrical switches as they can trigger sparks. Pour soapy water over the valve—if bubbles emerge, there is a leak. Call our absolute urgent direct emergency hotline immediately.'
  }
];
