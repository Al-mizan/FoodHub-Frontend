import { NextResponse, NextRequest } from 'next/server'
import { userService } from './services/user.service';
import { Roles } from './constants/roles';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    let isAuthenticated = false;
    let isAdmin = false;

    const { data } = await userService.getSession();
    if (data) {
        isAuthenticated = true;
        isAdmin = data.user?.role === Roles.ADMIN;
    }
    if (!isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: '/orders/:path*',
}