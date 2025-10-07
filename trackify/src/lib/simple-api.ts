import { useState } from 'react';
import { DonationFormData, PaymentFormData } from '@/types';

// Simplified API functions for immediate use
const API_BASE_URL = 'http://localhost:3000/api';

export async function createDonationAPI(donationData: DonationFormData) {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donationData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createPaymentAPI(paymentData: PaymentFormData) {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getDonationsAPI() {
  const response = await fetch(`${API_BASE_URL}/donations`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getPaymentsAPI() {
  const response = await fetch(`${API_BASE_URL}/payments`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getToolsAPI() {
  const response = await fetch(`${API_BASE_URL}/tools`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getComponentsAPI() {
  const response = await fetch(`${API_BASE_URL}/components`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Simple hooks for form submission
export function useDonationSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitDonation = async (donationData: DonationFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createDonationAPI(donationData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit donation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitDonation, isSubmitting, error };
}

export function usePaymentSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPayment = async (paymentData: PaymentFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createPaymentAPI(paymentData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit payment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPayment, isSubmitting, error };
}