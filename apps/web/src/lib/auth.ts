// Auth utilities for EduEquity OS frontend
// These functions work both on server and client sides

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const COOKIE_NAME = 'eduequity_session'
const REFRESH_COOKIE_NAME = 'refresh_token'
const USER_ROLE_COOKIE_NAME = 'user_role'

export interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  role: 'student' | 'teacher' | 'principal'
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  role: string | null
}

// Get current user from API using cookie-based auth
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      role: user.role,
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token
}

// Get user role from cookie
export async function getUserRole(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get(USER_ROLE_COOKIE_NAME)?.value || null
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

// Require specific roles - redirect to appropriate dashboard if not authorized
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth()
  const role = await getUserRole()
  
  if (!role || !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    redirect(getDashboardUrl(role) || '/login')
  }
  
  return user
}

// Get dashboard URL based on role
export function getDashboardUrl(role: string | null): string {
  const dashboardRoutes: Record<string, string> = {
    student: '/dashboard/student',
    teacher: '/dashboard/teacher',
    principal: '/dashboard/principal',
  }
  return role ? dashboardRoutes[role] || '/dashboard' : '/dashboard'
}

// Login function
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.detail || 'Login failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Network error' }
  }
}

// Register function
export async function register(data: {
  email: string
  password: string
  full_name: string
  role: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.detail || 'Registration failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Network error' }
  }
}

// Logout function - clears cookies and redirects to login
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
  
  // Clear cookies
  cookies().delete(COOKIE_NAME)
  cookies().delete(REFRESH_COOKIE_NAME)
  cookies().delete(USER_ROLE_COOKIE_NAME)
  
  redirect('/login')
}

// Client-side auth helpers (for use in client components)
export function getAuthCookie(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  const cookies = document.cookie.split('; ')
  const tokenCookie = cookies.find(row => row.startsWith(`${COOKIE_NAME}=`))
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

export function getUserRoleFromCookie(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  const cookies = document.cookie.split('; ')
  const roleCookie = cookies.find(row => row.startsWith(`${USER_ROLE_COOKIE_NAME}=`))
  return roleCookie ? roleCookie.split('=')[1] : null
}

export function isLoggedIn(): boolean {
  return !!getAuthCookie()
}

