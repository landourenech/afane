import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Créer la réponse avec redirection
  const response = NextResponse.redirect(new URL('/login', request.url));

  // Supprimer tous les cookies
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

  // Supprimer les cookies Supabase spécifiques
  const supabaseCookies = [
    'sb-127-auth-token',
    'sb-127-auth-token.0',
    'sb-127-auth-token.1',
    'sb-access-token',
    'sb-refresh-token',
    'sb-provider-token',
    'supabase-auth-token',
  ];

  supabaseCookies.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    });
  });

  return response;
}