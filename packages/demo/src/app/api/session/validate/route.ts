// Session validation API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies, validateSession } from '@/lib';

export async function GET() {
    try {
        const validation = await getSessionFromCookies();

        if (!validation.valid) {
            return NextResponse.json({ valid: false, reason: validation.reason }, { status: 401 });
        }

        return NextResponse.json({
            valid: true,
            session: {
                id: validation.session!.id,
                expiresAt: validation.session!.expiresAt,
                unlockedArticles: validation.session!.unlockedArticles,
                siteWideUnlock: validation.session!.siteWideUnlock,
            },
        });
    } catch (error) {
        console.error('Session validation error:', error);
        return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, articleId } = body;

        if (!token) {
            return NextResponse.json({ valid: false, reason: 'No token provided' }, { status: 400 });
        }

        const validation = await validateSession(token);

        if (!validation.valid) {
            return NextResponse.json({ valid: false, reason: validation.reason }, { status: 401 });
        }

        let articleUnlocked = false;
        if (articleId && validation.session) {
            articleUnlocked = validation.session.siteWideUnlock || validation.session.unlockedArticles.includes(articleId);
        }

        return NextResponse.json({
            valid: true,
            articleUnlocked,
            session: {
                id: validation.session!.id,
                expiresAt: validation.session!.expiresAt,
                unlockedArticles: validation.session!.unlockedArticles,
                siteWideUnlock: validation.session!.siteWideUnlock,
            },
        });
    } catch (error) {
        console.error('Session validation error:', error);
        return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
    }
}
