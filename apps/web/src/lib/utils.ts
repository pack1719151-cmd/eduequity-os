import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    return formatDate(date)
  }
}

export function generateQRCodeData(sessionId: string, timestamp: number): string {
  return JSON.stringify({
    sessionId,
    timestamp,
    type: 'attendance',
  })
}

export function parseQRCodeData(data: string): { sessionId: string; timestamp: number } | null {
  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'attendance' && parsed.sessionId && parsed.timestamp) {
      return {
        sessionId: parsed.sessionId,
        timestamp: parsed.timestamp,
      }
    }
    return null
  } catch {
    return null
  }
}

export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

export function getAttendanceStatus(percentage: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (percentage >= 90) return 'excellent'
  if (percentage >= 75) return 'good'
  if (percentage >= 60) return 'warning'
  return 'critical'
}

export function getGradeColor(grade: string): string {
  const gradeColors: Record<string, string> = {
    A: 'text-green-600',
    B: 'text-blue-600',
    C: 'text-yellow-600',
    D: 'text-orange-600',
    F: 'text-red-600',
  }
  return gradeColors[grade.charAt(0)] || 'text-gray-600'
}

