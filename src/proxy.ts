import { NextResponse, NextRequest } from 'next/server'
import { userService } from './services/user.service';
import { Roles } from './constants/roles';

/* ─────────────────────── Route Access Map ─────────────────────── *
 *  ADMIN    → can access everything                                *
 *  PROVIDER → can access provider + customer routes (not admin)    *
 *  CUSTOMER → can access customer routes only (not admin/provider) *
 * ─────────────────────────────────────────────────────────────── */

/** Routes that require authentication (any role) */
const AUTH_ROUTES = [
    '/profile',
    '/orders',
    '/cart',
];

/** Routes only accessible by ADMIN */
const ADMIN_ROUTES = [
    '/admin',
];

/** Routes only accessible by PROVIDER or ADMIN */
const PROVIDER_ROUTES = [
    '/provider',
    '/provider-profile',
];

/** All protected route prefixes that the middleware should intercept */
const PROTECTED_PREFIXES = [...AUTH_ROUTES, ...ADMIN_ROUTES, ...PROVIDER_ROUTES];

function matchesAny(pathname: string, prefixes: string[]) {
    return prefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ── 1. Skip non-protected routes ──
    if (!matchesAny(pathname, PROTECTED_PREFIXES)) {
        return NextResponse.next();
    }

    // ── 2. Fetch session ──
    const { data } = await userService.getSession();
    const user = data?.user;
    const role: string | undefined = user?.role;

    // ── 3. Not authenticated → redirect to login ──
    if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── 4. Admin can access everything ──
    if (role === Roles.ADMIN) {
        return NextResponse.next();
    }

    // ── 5. Block non-admin from admin routes ──
    if (matchesAny(pathname, ADMIN_ROUTES)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── 6. Provider can access provider + customer routes ──
    if (role === Roles.PROVIDER) {
        return NextResponse.next();
    }

    // ── 7. Block customer from provider routes ──
    if (matchesAny(pathname, PROVIDER_ROUTES)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── 8. Customer accessing customer routes → allow ──
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/orders/:path*',
        '/cart/:path*',
        '/admin/:path*',
        '/provider/:path*',
        '/provider-profile/:path*',
    ],
}