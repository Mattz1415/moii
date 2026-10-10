import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://www.sankavollerei.web.id';

// In-memory cache for API proxy to prevent burning the 45 req/min rate limit
const cache = new Map<string, { data: unknown; status: number; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000 * 5; // 5 minutes cache on server

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const targetPath = '/' + (path ? path.join('/') : '');
    const url = new URL(req.url);
    const queryString = url.search;
    const fullTargetUrl = `${BASE_URL}${targetPath}${queryString}`;

    const cacheKey = fullTargetUrl;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        status: cached.status,
        headers: {
          'X-Cache': 'HIT',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const response = await fetch(fullTargetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'SankaVerse-Web/1.0 (+https://github.com/SankaVollereii/Rest-Api-Anime-and-Comic)',
        'Accept': 'application/json, text/plain, */*',
      },
      next: { revalidate: 300 },
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.json();

    // Cache successful or 404 responses temporarily to respect Sanka rate limits
    if (response.status === 200 || response.status === 404) {
      // Keep cache size bounded
      if (cache.size > 200) {
        const firstKey = cache.keys().next().value;
        if (firstKey) cache.delete(firstKey);
      }
      cache.set(cacheKey, { data, status: response.status, timestamp: now });
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Cache': 'MISS',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: unknown) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Proxy fetch failed',
      },
      { status: 502 }
    );
  }
}
