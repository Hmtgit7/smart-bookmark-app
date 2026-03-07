import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt (metadata)
         * - Public landing page (/) — unauthenticated users can view it
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.*|apple-icon.*|$).*)',
    ],
};
