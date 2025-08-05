import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate unique user URL based on email and plan
export function generateUserUrl(email, planType) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:8000';
  
  // Use a more stable hash generation without Date.now() for SSR compatibility
  const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
  const hash = btoa(email + planType + timestamp).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  return `${baseUrl}/stream/${hash}`;
}

// Calculate expiration date (1 month from now)
export function getExpirationDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
