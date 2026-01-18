import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to forward request to backend
async function proxyRequest(
  request: NextRequest,
  method: string,
  path: string[]
) {
  const pathStr = path.join('/')
  const searchParams = request.nextUrl.search.toString()
  const targetUrl = `${API_URL}/api/v1/${pathStr}${searchParams ? `?${searchParams}` : ''}`

  console.log(`[Proxy] ${method} ${request.nextUrl.pathname} -> ${targetUrl}`)

  // Clone headers and remove problematic ones
  const headers = new Headers()
  for (const [key, value] of request.headers.entries()) {
    const lowerKey = key.toLowerCase()
    if (lowerKey !== 'host' && lowerKey !== 'transfer-encoding' && lowerKey !== 'connection') {
      headers.set(key, value)
    }
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  }

  // Forward body for POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      const contentType = request.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const body = await request.json()
        fetchOptions.body = JSON.stringify(body)
      } else {
        fetchOptions.body = await request.text()
      }
    } catch (e) {
      console.error('[Proxy] Failed to parse request body:', e)
    }
  }

  try {
    const response = await fetch(targetUrl, fetchOptions)
    console.log(`[Proxy] Backend responded with status: ${response.status}`)

    // Get response body for error logging
    let data: Record<string, unknown> = {}
    let responseText = ''
    try {
      responseText = await response.text()
      data = JSON.parse(responseText) as Record<string, unknown>
    } catch {
      responseText = responseText || 'No response body'
    }

    // Log backend response on error
    if (!response.ok) {
      console.error(`[Proxy] Backend error response: ${response.status} - ${responseText}`)
    }

    // Create response and forward cookies
    const newResponse = new NextResponse(responseText, {
      status: response.status,
      headers: response.headers,
    })

    // Forward all Set-Cookie headers from backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        newResponse.headers.append('set-cookie', value)
      }
    })

    return newResponse
  } catch (error) {
    console.error('[Proxy] Error connecting to backend:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API', error: String(error) },
      { status: 502 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, 'GET', path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, 'POST', path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, 'PUT', path)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, 'PATCH', path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, 'DELETE', path)
}

// Handle CORS preflight requests
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const response = new NextResponse(null, { status: 204 })
  
  // Allow CORS from any origin in development
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

