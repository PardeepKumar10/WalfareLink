
import { Cause, CauseCategory, RationItem } from './types';

export const RATION_ITEMS: RationItem[] = [
  { id: '1', name: 'Rice (40kg Bag)', price: 8500, unit: '40kg bag' },
  { id: '2', name: 'Sugar', price: 150, unit: '1kg' },
  { id: '3', name: 'Flour', price: 1200, unit: '10kg' },
  { id: '4', name: 'Cooking Oil', price: 450, unit: '1 Liter' },
  { id: '5', name: 'Daal (All Types)', price: 320, unit: '1kg' },
  { id: '6', name: 'Tea', price: 280, unit: '250g' },
  { id: '7', name: 'Dates', price: 500, unit: '1kg' },
];

export const CAUSES: Cause[] = [
  // Festival-based
  { id: 'f1', name: 'Eid-ul-Fitr', category: CauseCategory.FESTIVAL, recommendedKits: ['Monthly Family Pack', 'Eid Gift Box'] },
  { id: 'f2', name: 'Eid-ul-Adha', category: CauseCategory.FESTIVAL, recommendedKits: ['Qurbani Ration'] },
  { id: 'f3', name: 'Diwali', category: CauseCategory.FESTIVAL, recommendedKits: ['Sweets & Ration Kit'] },
  { id: 'f4', name: 'Holi', category: CauseCategory.FESTIVAL, recommendedKits: ['Sweets & Ration Kit'] },
  { id: 'f5', name: 'Ramadan Ration Drive', category: CauseCategory.FESTIVAL, recommendedKits: ['Sehar & Iftar Kit', 'Monthly Family Pack'] },
  
  // Disaster Relief
  { id: 'd1', name: 'Flood Relief', category: CauseCategory.DISASTER, recommendedKits: ['Emergency Food Pack', 'Ready-to-eat Meals'] },
  { id: 'd2', name: 'Earthquake Relief', category: CauseCategory.DISASTER, recommendedKits: ['Emergency Food Pack'] },
  { id: 'd3', name: 'Storm / Cyclone Relief', category: CauseCategory.DISASTER, recommendedKits: ['Emergency Food Pack'] },
  { id: 'd4', name: 'Heatwave Emergency', category: CauseCategory.DISASTER, recommendedKits: ['Hydration Kit'] },
  { id: 'd5', name: 'Cold Wave Emergency', category: CauseCategory.DISASTER, recommendedKits: ['Winter Warmth Pack'] },

  // Emergency & Social
  { id: 'e1', name: 'Fire Accident Relief', category: CauseCategory.EMERGENCY, recommendedKits: ['Survivor Support Kit'] },
  { id: 'e2', name: 'Refugee Support', category: CauseCategory.EMERGENCY, recommendedKits: ['Sustenance Pack'] },
  { id: 'e3', name: 'Orphan Support', category: CauseCategory.EMERGENCY, recommendedKits: ['Education & Nutrition Kit'] },
  { id: 'e4', name: 'Monthly Family Ration', category: CauseCategory.EMERGENCY, recommendedKits: ['Standard Monthly Pack'] },
];

export const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Quetta', 'Peshawar', 'Multan', 'Faisalabad', 'Sukkur', 'Thatta', 'Gawadar'
];

export const AREAS = [
  'North Sector A', 'Orphanage Road', 'Refugee Camp 7', 'District Hospital Zone', 'Flood Buffer Area', 'Old Town Square'
];
