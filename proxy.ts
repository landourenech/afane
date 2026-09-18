import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
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

  // Assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf|json|geojson|css|js|map|txt|xml)$/i.test(pathname)
  ) {
    return supabaseResponse;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Routes PUBLIQUES (marketing)
  const publicRoutes = ['/', '/boutique', '/carte', '/conseil', '/apropos', '/faq', '/u/'];
  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));

  if (isPublic) {
    // Profil public /u/[username]
    if (pathname.startsWith('/u/')) {
      const username = pathname.split('/')[2];
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (!profile) {
        return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
      }
    }
    return supabaseResponse;
  }

  // Routes AUTH
  if (pathname === '/login') {
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
          : '/dashboard';
        return NextResponse.redirect(url);
      }
    }
    return supabaseResponse;
  }

  // Routes PROTÉGÉES
  if (!user) {
    // Vérifier si c'est un username
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    if (firstSegment) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', firstSegment)
        .maybeSingle();

      if (!profile) {
        return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf|json|geojson|css|js|map|txt|xml)$).*)',
  ],
};