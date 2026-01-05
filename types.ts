
export enum Occupation {
  JOB = 'job',
  BUSINESS = 'business',
  STUDENT = 'student'
}

export enum Role {
  DONOR = 'donor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Added for academic project simulation
  phone: string;
  cnic: string;
  occupation: Occupation;
  role: Role;
}

export enum CauseCategory {
  FESTIVAL = 'Festival-based',
  DISASTER = 'Natural Disaster Relief',
  EMERGENCY = 'Emergency & Social Welfare'
}

export interface Cause {
  id: string;
  name: string;
  category: CauseCategory;
  recommendedKits?: string[];
}

export interface RationItem {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface DonationItem {
  itemId: string;
  quantity: number;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  causeId: string;
  causeName: string;
  type: 'money' | 'ration';
  totalAmount: number;
  items?: DonationItem[];
  distribution: {
    city: string;
    area: string;
    date: string;
  };
  createdAt: string | Date; // Changed to handle ISO strings from LocalStorage
}
