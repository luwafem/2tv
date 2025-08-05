import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate unique user URL based on email and plan
export function generateUserUrl(email, planType) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:8000';
  
  const hash = btoa(email + planType + Date.now()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
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
