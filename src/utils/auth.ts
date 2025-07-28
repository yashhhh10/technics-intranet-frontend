// User and role utilities for frontend usage
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

// Mock current user - replace with actual user from authentication
export const getCurrentUser = (): User => {
  // This would typically come from your authentication system
  return {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@tecnics.com',
    role: 'admin', // Change this to test different roles
    department: 'Information Technology'
  };
};

export const AUTHORIZED_ROLES = ['hr', 'vp', 'marketingHead', 'techHead', 'admin', 'director'];

export const canCreateContent = (user: User): boolean => {
  return AUTHORIZED_ROLES.includes(user.role);
};

export const hasRole = (user: User, role: string): boolean => {
  return user.role === role;
};
// Utility to handle authentication and bearer token management
// Usage: import { loginAndGetToken, getStoredToken, authorizedFetch } from './auth';

// Always read token from localStorage for latest value

// Fetch token from backend and store it
export async function loginAndGetToken(email: string, password: string): Promise<string> {
  const response = await fetch('http://localhost:5001/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed: ' + (await response.text()));
  }
  const data = await response.json();
  if (!data.token) {
    throw new Error('No token returned from login');
  }
  localStorage.setItem('bearerToken', data.token);
  return data.token;
}

// Get token from localStorage
export function getStoredToken(): string | null {
  return localStorage.getItem('bearerToken');
}

// Clear token from localStorage (for logout)
export function clearToken() {
  localStorage.removeItem('bearerToken');
}

// Helper to add Authorization header to fetch options
export function authorizedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const bearer = getStoredToken();
  if (!bearer) throw new Error('No bearer token available');
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${bearer}`,
    'Content-Type': 'application/json'
  };
  return fetch(url, { ...options, headers });
}