import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    apiClient.post('/api/v1/auth/register', data),
  logout: () => apiClient.post('/api/v1/auth/logout'),
  refresh: () => apiClient.post('/api/v1/auth/refresh'),
  me: () => apiClient.get('/api/v1/auth/me'),
}

export const userApi = {
  getProfile: () => apiClient.get('/api/v1/users/me'),
  updateProfile: (data: Partial<{ firstName: string; lastName: string; email: string }>) =>
    apiClient.patch('/api/v1/users/me', data),
  getAllUsers: (role?: string) => apiClient.get(`/api/v1/users${role ? `?role=${role}` : ''}`),
}

export const attendanceApi = {
  getSessions: (params?: { startDate?: string; endDate?: string; courseId?: string }) =>
    apiClient.get('/api/v1/attendance/sessions', { params }),
  getSession: (sessionId: string) => apiClient.get(`/api/v1/attendance/sessions/${sessionId}`),
  createSession: (data: { courseId: string; date: string; duration: number; location?: string }) =>
    apiClient.post('/api/v1/attendance/sessions', data),
  getQRCode: (sessionId: string) => apiClient.get(`/api/v1/attendance/sessions/${sessionId}/qr`),
  markAttendance: (sessionId: string, data: { studentId: string; status: 'present' | 'absent' | 'late' | 'excused' }) =>
    apiClient.post(`/api/v1/attendance/sessions/${sessionId}/mark`, data),
  getMyAttendance: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/api/v1/attendance/my', { params }),
  getStats: (courseId?: string) => apiClient.get('/api/v1/attendance/stats', { params: { courseId } }),
}

export const quizApi = {
  getQuizzes: (params?: { courseId?: string; status?: 'draft' | 'published' | 'closed' }) =>
    apiClient.get('/api/v1/quizzes', { params }),
  getQuiz: (quizId: string) => apiClient.get(`/api/v1/quizzes/${quizId}`),
  createQuiz: (data: { title: string; description?: string; courseId: string; timeLimit?: number; passingScore?: number }) =>
    apiClient.post('/api/v1/quizzes', data),
  updateQuiz: (quizId: string, data: Partial<{ title: string; description: string; timeLimit: number; passingScore: number; status: string }>) =>
    apiClient.patch(`/api/v1/quizzes/${quizId}`, data),
  deleteQuiz: (quizId: string) => apiClient.delete(`/api/v1/quizzes/${quizId}`),
  addQuestion: (quizId: string, data: { question: string; type: string; options?: string[]; correctAnswer: string | string[]; points: number }) =>
    apiClient.post(`/api/v1/quizzes/${quizId}/questions`, data),
  submitQuiz: (quizId: string, data: { answers: Array<{ questionId: string; answer: string | string[] }> }) =>
    apiClient.post(`/api/v1/quizzes/${quizId}/submit`, data),
  getResults: (quizId: string) => apiClient.get(`/api/v1/quizzes/${quizId}/results`),
}

export const feedApi = {
  getPendingApprovals: (params?: { type?: string; status?: string }) =>
    apiClient.get('/api/v1/feed/pending', { params }),
  submitApproval: (data: { type: string; title: string; description: string; relatedId?: string }) =>
    apiClient.post('/api/v1/feed/submit', data),
  approveRequest: (requestId: string, data?: { comment?: string }) =>
    apiClient.post(`/api/v1/feed/approve/${requestId}`, data),
  rejectRequest: (requestId: string, data?: { comment?: string }) =>
    apiClient.post(`/api/v1/feed/reject/${requestId}`, data),
  getMyRequests: (params?: { status?: string }) => apiClient.get('/api/v1/feed/my-requests', { params }),
}

export default apiClient

