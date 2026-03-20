/**
 * Seed script to populate the database with initial products
 * Run with: node --import tsx scripts/seed.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rohanmane:Rohan12@cluster0.jub9cxh.mongodb.net/';

const products = [
  {
    name: {
      en: 'Personal Design Cards',
      hi: 'व्यक्तिगत डिजाइन कार्ड',
      mr: 'वैयक्तिक डिझाइन कार्ड्स',
    },
    description: {
      en: 'Custom designed personal cards for all occasions including weddings, birthdays, and corporate events.',
      hi: 'शादियों, जन्मदिन और कॉर्पोरेट कार्यक्रमों सहित सभी अवसरों के लिए कस्टम डिजाइन किए गए व्यक्तिगत कार्ड।',
      mr: 'लग्न, वाढदिवस आणि कॉर्पोरेट कार्यक्रम सहित सर्व प्रसंगांसाठी कस्टम डिझाइन केलेले वैयक्तिक कार्ड्स.',
    },
    category: 'personal',
    images: [],
    customizationOptions: {
      sizes: ['A4', 'A5', 'A6', 'Custom'],
      materials: ['Matte', 'Glossy', 'Premium Cardstock'],
    },
    basePrice: 500,
    featured: true,
    active: true,
  },
  {
    name: {
      en: 'Acrylic Name Plates',
      hi: 'एक्रिलिक नाम प्लेट',
      mr: 'ॲक्रिलिक नेम प्लेट्स',
    },
    description: {
      en: 'Premium quality acrylic name plates for homes and offices. Available in various colors and finishes.',
      hi: 'घरों और कार्यालयों के लिए प्रीमियम गुणवत्ता एक्रिलिक नाम प्लेट। विभिन्न रंगों और फिनिश में उपलब्ध।',
      mr: 'घरे आणि कार्यालयांसाठी प्रीमियम गुणवत्तेच्या ॲक्रिलिक नेम प्लेट्स. विविध रंग आणि फिनिशमध्ये उपलब्ध.',
    },
    category: 'acrylic',
    images: [],
    customizationOptions: {
      sizes: ['6x2 inches', '8x3 inches', '10x4 inches', 'Custom'],
      materials: ['Clear Acrylic', 'Frosted', 'Colored', 'Mirror Finish'],
    },
    basePrice: 800,
    featured: true,
    active: true,
  },
  {
    name: {
      en: 'LED Signages',
      hi: 'LED साइनेज',
      mr: 'LED साइनेजेस',
    },
    description: {
      en: 'Eye-catching LED signages for shops, offices, and events. Programmable displays with remote control.',
      hi: 'दुकानों, कार्यालयों और कार्यक्रमों के लिए आकर्षक LED साइनेज। रिमोट कंट्रोल के साथ प्रोग्रामेबल डिस्प्ले।',
      mr: 'दुकाने, कार्यालये आणि कार्यक्रमਾਂ ਲਈ आकर्षक LED साइनेजेस. रिमोट कंट्रोलसह प्रोग्रामेबल डिस्प्ले.',
    },
    category: 'led',
    images: [],
    customizationOptions: {
      sizes: ['12x4 inches', '24x8 inches', '36x12 inches', 'Custom'],
      materials: ['Single Color', 'RGB Full Color', 'Animated'],
    },
    basePrice: 5000,
    featured: true,
    active: true,
  },
  {
    name: {
      en: 'Roll-up Standees',
      hi: 'रोल-अप स्टैंडी',
      mr: 'रोल-अप स्टँडीज',
    },
    description: {
      en: 'Portable roll-up standees perfect for exhibitions, events, and promotional displays.',
      hi: 'प्रदर्शनियों, कार्यक्रमों और प्रमोशनल डिस्प्ले के लिए आदर्श पोर्टेबल रोल-अप स्टैंडी।',
      mr: 'प्रदर्शने, कार्यक्रम आणि प्रमोशनल डिस्प्लेसाठी आदर्श पोर्टेबल रोल-अप स्टँडीज.',
    },
    category: 'standees',
    images: [],
    customizationOptions: {
      sizes: ['33x80 inches', '33x60 inches', 'Custom'],
      materials: ['Standard Vinyl', 'Premium Fabric', 'HD Print'],
    },
    basePrice: 1500,
    featured: false,
    active: true,
  },
  {
    name: {
      en: 'Custom Stickers',
      hi: 'कस्टम स्टिकर्स',
      mr: 'कस्टम स्टिकर्स',
    },
    description: {
      en: 'High-quality custom stickers for branding, packaging, and promotional purposes. Various shapes and sizes available.',
      hi: 'ब्रांडिंग, पैकेजिंग और प्रमोशनल उद्देश्यों के लिए उच्च गुणवत्ता वाले कस्टम स्टिकर्स। विभिन्न आकार और आकार उपलब्ध।',
      mr: 'ब्रँडिंग, पॅकेजिंग आणि प्रमोशनल उद्देशांसाठी उच्च-गुणवत्तेचे कस्टम स्टिकर्स. विविध आकार आणि साइज उपलब्ध.',
    },
    category: 'stickers',
    images: [],
    customizationOptions: {
      sizes: ['1 inch', '2 inch', '3 inch', 'Custom'],
      materials: ['Vinyl', 'Paper', 'Transparent', 'Holographic'],
    },
    basePrice: 200,
    featured: false,
    active: true,
  },
  {
    name: {
      en: 'Large Hoardings',
      hi: 'बड़े होर्डिंग्स',
      mr: 'मोठे होर्डिंग्ज',
    },
    description: {
      en: 'Large format outdoor hoardings for advertising and branding. Weather-resistant and durable.',
      hi: 'विज्ञापन और ब्रांडिंग के लिए बड़े फॉर्मेट के आउटडोर होर्डिंग्स। मौसम-प्रतिरोधी और टिकाऊ।',
      mr: 'जाहिरात आणि ब्रँडिंगसाठी मोठ्या फॉरमॅटचे आउटडोर होर्डिंग्ज. हवामान-प्रतिरोधक आणि टिकाऊ.',
    },
    category: 'hoardings',
    images: [],
    customizationOptions: {
      sizes: ['10x20 ft', '15x30 ft', '20x40 ft', 'Custom'],
      materials: ['Flex Banner', 'Vinyl Mesh', 'Frontlit', 'Backlit'],
    },
    basePrice: 15000,
    featured: true,
    active: true,
  },
  {
    name: {
      en: 'Promotional Banners',
      hi: 'प्रमोशनल बैनर',
      mr: 'प्रमोशनल बॅनर्स',
    },
    description: {
      en: 'High-impact promotional banners and branchers for retail stores and events.',
      hi: 'रिटेस्ट स्टोर और कार्यक्रमों के लिए उच्च-प्रभाव प्रमोशनल बैनर और ब्रांचर्स।',
      mr: 'रिटेल स्टोअर्स आणि कार्यक्रमਾਂ ਲਈ उच्च-प्रभाव प्रमोशनल बॅनर्स आणि ब्रँचर्स.',
    },
    category: 'banners',
    images: [],
    customizationOptions: {
      sizes: ['2x6 ft', '3x8 ft', '4x10 ft', 'Custom'],
      materials: ['Flex', 'Vinyl', 'Cloth', 'Mesh'],
    },
    basePrice: 800,
    featured: false,
    active: true,
  },
];

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import Product model
    const Product = (await import('../models/Product')).default;

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert new products
    console.log('📦 Inserting new products...');
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
