// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base Entity Interfaces
export interface IUser {
  _id?: string;
  user_id: string;
  username: string;
  email: string;
  password: string;
  membershipLevel: 'basic' | 'premium' | 'lifetime';
  joinDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITool {
  _id?: string;
  tool_id: string;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  location: string;
  lastMaintenance: Date;
  purchaseDate: Date;
  cost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayment {
  _id?: string;
  payment_id: string;
  userId: string;
  serviceName: string;
  description?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  serviceDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDonation {
  _id?: string;
  donation_id: string;
  userId: string;
  type: 'monetary' | 'item';
  amount?: number; // Only for monetary donations
  itemDescription?: string; // Only for item donations
  estimatedValue?: number; // For item donations
  condition?: 'new' | 'excellent' | 'good' | 'fair'; // For item donations
  donationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComponent {
  _id?: string;
  component_id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  storageLocation: string;
  supplier?: string;
  costPerUnit: number;
  lastRestocked: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form Data Types for Frontend
export interface DonationFormData {
  donorName: string;
  type: 'monetary' | 'item';
  amount?: number;
  itemDescription?: string;
  estimatedValue?: number;
  condition?: 'new' | 'excellent' | 'good' | 'fair';
}

export interface PaymentFormData {
  userId: string;
  serviceName: string;
  description?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'paypal';
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  membershipLevel: 'basic' | 'premium' | 'lifetime';
}

export interface ToolFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  cost: number;
}

export interface ComponentFormData {
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  storageLocation: string;
  supplier?: string;
  costPerUnit: number;
}

// Dashboard Service Types
export interface ServiceItem {
  id: string;
  title: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

// Error Types
export interface ApiError {
  success: false;
  error: string;
  status?: number;
}

// Payment Service Types for Innovation Labs
export type PaymentServiceType = '3d-printer' | 'soldering-station' | 'tools' | 'components';

export type FilamentType = 'PLA' | 'ABS';

export interface FilamentPrice {
  PLA: number; // ₱1200 / 1kg spool
  ABS: number; // ₱1350 / 1kg spool
}

export interface ServiceRates {
  power: number; // ₱5/hour for 3D printer
  soldering: number; // ₱10/hour for soldering station
  spoolWeight: number; // 1000g
}

export interface PrinterPaymentData {
  filamentWeight: number; // in grams
  filamentType: FilamentType;
  printingTime: number; // in hours
  filamentCost: number;
  powerCost: number;
  totalCost: number;
}

export interface SolderingPaymentData {
  hoursUsed: number;
  totalCost: number;
}

export interface ToolComponentSelection {
  id: string;
  name: string;
  costPerUnit: number;
  quantity: number;
  totalCost: number;
}

export interface ToolsComponentsPaymentData {
  selectedItems: ToolComponentSelection[];
  totalCost: number;
}

export interface PaymentServiceFormData {
  serviceType: PaymentServiceType;
  userId: string;
  data: PrinterPaymentData | SolderingPaymentData | ToolsComponentsPaymentData;
}

// Enhanced Payment Interface for Innovation Labs
export interface InnovationLabPayment extends Omit<IPayment, 'serviceName'> {
  serviceName: PaymentServiceType;
  serviceDetails: PrinterPaymentData | SolderingPaymentData | ToolsComponentsPaymentData;
}

// Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
}

// Authentication Response
export interface AuthResponse {
  success: boolean;
  user?: IUser;
  token?: string;
  error?: string;
}