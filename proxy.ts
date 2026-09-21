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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Laisser passer les API et assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf|json|geojson|css|js|map|txt|xml)$/i.test(pathname)
  ) {
    return supabaseResponse;
  }

  // ═══════════════════════════════════════════════════════
  // ROUTES PUBLIQUES (accessibles sans connexion)
  // ═══════════════════════════════════════════════════════
  const publicRoutes = [
    '/',
    '/login',
    '/signup',              // ✅ Ajouté
    '/forgot-password',     // ✅ Ajouté
    '/onboarding',
    '/boutique',
    '/carte',
    '/conseil',
    '/apropos',
    '/faq',
    '/contact',
    '/newsletter',
    '/help',
    '/cookie-policy',
    '/legal',
    '/privacy',
    '/terms',
  ];

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });

  // Si route publique, laisser passer
  if (isPublicRoute) {
    // Cas spécial : utilisateur connecté va sur /login ou /signup
    if (pathname === '/login' || pathname === '/signup') {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, onboarding_completed')
          .eq('email', user.email)
          .maybeSingle();

        if (profile) {
          const url = request.nextUrl.clone();
          url.pathname = !profile.onboarding_completed
            ? '/onboarding'
            : `/${profile.username || user.id}`;
          return NextResponse.redirect(url);
        }
      }
    }

    return supabaseResponse;
  }

  // ═══════════════════════════════════════════════════════
  // ROUTES PROTÉGÉES
  // ═══════════════════════════════════════════════════════
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  if (!profile) {
    if (pathname !== '/onboarding') {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (!profile.onboarding_completed && pathname !== '/onboarding') {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  if (profile.onboarding_completed && pathname === '/onboarding') {
    const url = request.nextUrl.clone();
    url.pathname = `/${profile.username || user.id}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf|json|geojson|css|js|map|txt|xml)$).*)',
  ],
};
