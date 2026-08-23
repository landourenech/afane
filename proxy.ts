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

  // Laisser passer les routes API
  if (pathname.startsWith('/api/')) {
    return supabaseResponse;
  }

  // Récupérer l'utilisateur Supabase
  const { data: { user } } = await supabase.auth.getUser();

  console.log('Proxy:', pathname, '- User:', user?.email || 'No user');

  // Routes publiques
  if (pathname === '/login' || pathname === '/') {
    if (user) {
      // Vérifier l'état de l'onboarding dans les cookies d'abord
      const onboardingCookie = request.cookies.get('onboarding_completed');
      const roleCookie = request.cookies.get('user_role');
      
      if (onboardingCookie?.value === 'true') {
        // L'onboarding est complété
        const url = request.nextUrl.clone();
        url.pathname = roleCookie?.value === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(url);
      } else if (onboardingCookie?.value === 'false') {
        // L'onboarding n'est pas complété
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
      
      // Si pas de cookie, vérifier dans Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role')
        .eq('email', user.email)
        .maybeSingle();

      if (profile) {
        if (!profile.onboarding_completed) {
          const url = request.nextUrl.clone();
          url.pathname = '/onboarding';
          return NextResponse.redirect(url);
        } else {
          const url = request.nextUrl.clone();
          url.pathname = profile.role === 'admin' ? '/admin' : '/dashboard';
          return NextResponse.redirect(url);
        }
      }
    }
    return supabaseResponse;
  }

  // Routes protégées
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding') || pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};