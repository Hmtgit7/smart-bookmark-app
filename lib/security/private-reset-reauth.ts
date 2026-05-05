import crypto from 'crypto';

export const PRIVATE_RESET_REAUTH_COOKIE = 'sb-private-reset-reauth';

const TOKEN_TTL_SECONDS = 10 * 60;

type ReauthMethod = 'google' | 'password';

interface ReauthPayload {
    userId: string;
    method: ReauthMethod;
    issuedAt: number;
}

function getSecret(): string {
    return (
        process.env.PRIVATE_REAUTH_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        'dev-private-reset-secret'
    );
}

function base64UrlEncode(input: string): string {
    return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string): string {
    return Buffer.from(input, 'base64url').toString('utf8');
}

function signPayload(encodedPayload: string): string {
    return crypto.createHmac('sha256', getSecret()).update(encodedPayload).digest('base64url');
}

export function createPrivateResetReauthToken(userId: string, method: ReauthMethod): string {
    const payload: ReauthPayload = {
        userId,
        method,
        issuedAt: Date.now(),
    };

    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = signPayload(encodedPayload);

    return `${encodedPayload}.${signature}`;
}

export function verifyPrivateResetReauthToken(token: string | undefined, userId: string): boolean {
    if (!token) return false;

    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) return false;

    const expectedSignature = signPayload(encodedPayload);

    if (
        signature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
        return false;
    }

    try {
        const payload = JSON.parse(base64UrlDecode(encodedPayload)) as ReauthPayload;

        if (payload.userId !== userId) return false;
        if (!['google', 'password'].includes(payload.method)) return false;

        const ageInSeconds = Math.floor((Date.now() - payload.issuedAt) / 1000);
        return ageInSeconds >= 0 && ageInSeconds <= TOKEN_TTL_SECONDS;
    } catch {
        return false;
    }
}

export function getPrivateResetReauthCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: TOKEN_TTL_SECONDS,
    };
}
