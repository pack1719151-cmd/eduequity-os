import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const searchParams = request.nextUrl.search.toString()
  
  const url = `${API_URL}/api/v1/${path}${searchParams ? `?${searchParams}` : ''}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!,
        }),
        ...Object.fromEntries(request.headers.entries()),
      },
      credentials: 'include',
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API' },
      { status: 502 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${API_URL}/api/v1/${path}`
  
  try {
    const body = await request.json()
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!,
        }),
        ...Object.fromEntries(request.headers.entries()),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })

    const data = await response.json()
    
    // Copy cookies from backend response to client
    const newResponse = NextResponse.json(data, {
      status: response.status,
    })
    
    // Forward cookies from backend
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      newResponse.headers.set('set-cookie', setCookieHeaders)
    }
    
    return newResponse
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API' },
      { status: 502 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${API_URL}/api/v1/${path}`
  
  try {
    const body = await request.json()
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!,
        }),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API' },
      { status: 502 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${API_URL}/api/v1/${path}`
  
  try {
    const body = await request.json()
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!,
        }),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API' },
      { status: 502 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${API_URL}/api/v1/${path}`
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!,
        }),
      },
      credentials: 'include',
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { detail: 'Failed to connect to backend API' },
      { status: 502 }
    )
  }
}

