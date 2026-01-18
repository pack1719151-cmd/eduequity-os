"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface HealthResponse {
  status?: string
  version?: string
  auth_version?: string
  message?: string
  detail?: string
}

export default function TestApiPage() {
  const [rootHealthLoading, setRootHealthLoading] = useState(false)
  const [authHealthLoading, setAuthHealthLoading] = useState(false)
  const [rootHealth, setRootHealth] = useState<HealthResponse | null>(null)
  const [authHealth, setAuthHealth] = useState<HealthResponse | null>(null)
  const [rootError, setRootError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const testRootHealth = async () => {
    setRootHealthLoading(true)
    setRootHealth(null)
    setRootError(null)
    try {
      const response = await apiClient.get<HealthResponse>("/health")
      setRootHealth(response)
    } catch (error: unknown) {
      const err = error as { response?: { data?: HealthResponse }, message?: string }
      setRootError(err.response?.data?.detail || err.message || "Unknown error")
    } finally {
      setRootHealthLoading(false)
    }
  }

  const testAuthHealth = async () => {
    setAuthHealthLoading(true)
    setAuthHealth(null)
    setAuthError(null)
    try {
      const response = await apiClient.get<HealthResponse>("/api/v1/auth/health")
      setAuthHealth(response)
    } catch (error: unknown) {
      const err = error as { response?: { data?: HealthResponse }, message?: string }
      setAuthError(err.response?.data?.detail || err.message || "Unknown error")
    } finally {
      setAuthHealthLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Test</h1>
        <p className="text-gray-600 mb-8">
          Test the connection between the frontend and backend APIs
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Root Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                GET /health
              </CardTitle>
              <CardDescription>
                Tests the root health endpoint of the backend API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testRootHealth} 
                disabled={rootHealthLoading}
                className="w-full"
              >
                {rootHealthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Root Health
              </Button>

              {rootHealthLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}

              {rootHealth && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Success!</span>
                  </div>
                  <pre className="text-sm bg-white rounded p-3 overflow-auto">
                    {JSON.stringify(rootHealth, null, 2)}
                  </pre>
                </div>
              )}

              {rootError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Error!</span>
                  </div>
                  <pre className="text-sm bg-white rounded p-3 overflow-auto text-red-600">
                    {rootError}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auth Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                GET /api/v1/auth/health
              </CardTitle>
              <CardDescription>
                Tests the auth health endpoint of the backend API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testAuthHealth} 
                disabled={authHealthLoading}
                className="w-full"
              >
                {authHealthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Auth Health
              </Button>

              {authHealthLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}

              {authHealth && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Success!</span>
                  </div>
                  <pre className="text-sm bg-white rounded p-3 overflow-auto">
                    {JSON.stringify(authHealth, null, 2)}
                  </pre>
                </div>
              )}

              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Error!</span>
                  </div>
                  <pre className="text-sm bg-white rounded p-3 overflow-auto text-red-600">
                    {authError}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current API configuration and connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Frontend URL:</strong> http://localhost:3000
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

