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
  
  // Clone headers and remove 'host' to avoid conflicts
  const headers = new Headers()
  for (const [key, value] of request.headers.entries()) {
    if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'transfer-encoding') {
      headers.set(key, value)
    }
  }
  headers.set('X-Forwarded-Host', request.headers.get('host') || 'localhost:3000')
  
  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  }
  
  // Forward body for POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      const body = await request.json()
      fetchOptions.body = JSON.stringify(body)
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }
    } catch (e) {
      console.error('[Proxy] Failed to parse request body:', e)
    }
  }
  
  try {
    const response = await fetch(targetUrl, fetchOptions)
    console.log(`[Proxy] Backend responded with status: ${response.status}`)
    
    const data = await response.json().catch(() => ({}))
    
    // Create response and forward cookies
    const newResponse = NextResponse.json(data, {
      status: response.status,
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

