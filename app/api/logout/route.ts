import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true });

    // Nettoyer tous les cookies
    const cookieHeader = request.headers.get('cookie');
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      
      cookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        
        if (name) {
          response.cookies.set(name, '', {
            maxAge: 0,
            path: '/',
            expires: new Date(0),
          });
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}