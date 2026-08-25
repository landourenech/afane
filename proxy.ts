import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Laisser passer les routes API et statiques
  if (
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') || 
    pathname.startsWith('/favicon.ico')
  ) {
    return supabaseResponse;
  }

  // Récupérer l'utilisateur Supabase
  const { data: { user } } = await supabase.auth.getUser();

  console.log('📍 Proxy:', pathname, '- User:', user?.email || 'No user');

  // ============ ROUTES PUBLIQUES ============
  const publicRoutes = ['/login', '/onboarding', '/help', '/cookie-policy'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    // Si l'utilisateur est connecté et va sur /login
    if (user && pathname === '/login') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, onboarding_completed, role')
        .eq('email', user.email)
        .maybeSingle();

      if (profile) {
        const url = request.nextUrl.clone();
        
        if (!profile.onboarding_completed) {
          url.pathname = '/onboarding';
        } else {
          // Rediriger vers /{username}
          url.pathname = `/${profile.username || user.id}`;
        }
        
        return NextResponse.redirect(url);
      }
    }

    // Si l'utilisateur est connecté et va sur /onboarding mais a déjà complété
    if (user && pathname === '/onboarding') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, onboarding_completed')
        .eq('email', user.email)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        const url = request.nextUrl.clone();
        url.pathname = `/${profile.username || user.id}`;
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  }

  // ============ ROUTE RACINE ============
  if (pathname === '/') {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, onboarding_completed')
        .eq('email', user.email)
        .maybeSingle();

      if (profile) {
        const url = request.nextUrl.clone();
        
        if (!profile.onboarding_completed) {
          url.pathname = '/onboarding';
        } else {
          url.pathname = `/${profile.username || user.id}`;
        }
        
        return NextResponse.redirect(url);
      }
    }
    return supabaseResponse;
  }

  // ============ ROUTES PROTÉGÉES ============
  // Routes qui nécessitent une authentification
  const isProtectedRoute = 
    !pathname.startsWith('/login') && 
    !pathname.startsWith('/onboarding') &&
    !pathname.startsWith('/help') &&
    !pathname.startsWith('/cookie-policy') &&
    pathname !== '/';

  if (isProtectedRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Vérifier l'onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, onboarding_completed, role')
      .eq('email', user.email)
      .maybeSingle();

    if (profile) {
      // Si l'onboarding n'est pas complété
      if (!profile.onboarding_completed && pathname !== '/onboarding') {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }

      // Vérifier que l'utilisateur accède à son propre espace
      if (profile.onboarding_completed) {
        const username = profile.username || user.id;
        const expectedPrefix = `/${username}`;

        // Routes admin - vérifier le rôle
        if (pathname.startsWith('/admin') && profile.role !== 'admin') {
          const url = request.nextUrl.clone();
          url.pathname = `/${username}`;
          return NextResponse.redirect(url);
        }

        // Si l'utilisateur essaie d'accéder à un autre username
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          const firstSegment = pathSegments[0];
          
          // Si le premier segment n'est pas le username de l'utilisateur
          // et n'est pas une route spéciale
          const specialRoutes = ['admin', 'help', 'cookie-policy'];
          if (!specialRoutes.includes(firstSegment) && firstSegment !== username) {
            const url = request.nextUrl.clone();
            url.pathname = `/${username}${pathname.replace(`/${firstSegment}`, '')}`;
            return NextResponse.redirect(url);
          }
        }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};