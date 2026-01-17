export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'principal' | 'admin'
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceSession {
  id: string
  courseId: string
  courseName: string
  date: string
  duration: number
  location?: string
  qrCode?: string
  qrCodeExpiry?: string
  teacherId: string
  teacherName: string
  status: 'active' | 'closed'
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  studentName: string
  status: 'present' | 'absent' | 'late' | 'excused'
  timestamp: string
  createdAt: string
}

export interface AttendanceStats {
  totalSessions: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  attendanceRate: number
}

export interface Quiz {
  id: string
  title: string
  description?: string
  courseId: string
  courseName: string
  timeLimit?: number
  passingScore: number
  status: 'draft' | 'published' | 'closed'
  questionCount: number
  totalPoints: number
  createdAt: string
  updatedAt: string
  creatorId: string
  creatorName: string
}

export interface Question {
  id: string
  quizId: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correctAnswer: string | string[]
  points: number
  order: number
}

export interface QuizSubmission {
  id: string
  quizId: string
  studentId: string
  studentName: string
  answers: Array<{
    questionId: string
    answer: string | string[]
  }>
  score?: number
  percentage?: number
  passed?: boolean
  submittedAt: string
  gradedAt?: string
}

export interface ApprovalRequest {
  id: string
  type: 'attendance' | 'quiz' | 'other'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  requesterId: string
  requesterName: string
  relatedId?: string
  approverId?: string
  approverName?: string
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

