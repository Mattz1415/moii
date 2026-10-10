import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    const urlObj = new URL(targetUrl);
    const host = urlObj.hostname.toLowerCase();

    // Determine appropriate referer based on upstream host
    let referer = 'https://otakudesu.blog/';
    if (host.includes('vidhide') || host.includes('odvidhide')) {
      referer = 'https://desustream.net/';
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      },
    });

    let html = await response.text();

    // Check if the page contains a direct video URL (e.g. DesuStream odcloud .mp4 / .m3u8)
    const directVideoMatch =
      html.match(/const\s+videoURL\s*=\s*["']([^"']+)["']/i) ||
      html.match(/file:\s*["']([^"']+\.mp4[^"']*)["']/i) ||
      html.match(/source\s+src=["']([^"']+\.mp4[^"']*)["']/i);

    if (directVideoMatch && directVideoMatch[1]) {
      const rawVideoUrl = directVideoMatch[1];
      // Render an ad-free, high-performance HTML5 video player with sleek controls
      const customPlayerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SankaVerse Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
    .player-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; position: relative; }
    video { width: 100%; height: 100%; object-fit: contain; background: #000; outline: none; }
  </style>
</head>
<body>
  <div class="player-wrap">
    <video
      id="videoPlayer"
      controls
      playsinline
      webkit-playsinline
      autoplay
      preload="auto"
      src="${rawVideoUrl}"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</body>
</html>`;

      return new NextResponse(customPlayerHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'X-Frame-Options': 'ALLOWALL',
        },
      });
    }

    // Specially handle Vidhide & Odvidhide anti-sandbox blocks
    if (host.includes('vidhide') || host.includes('odvidhide')) {
      // 1. Remove the location redirect to sandboxed.html
      html = html.replace(/location\[[^\]]+\]\s*=\s*["']\/sandboxed\.html["']/g, 'void 0');
      html = html.replace(/location\.href\s*=\s*["']\/sandboxed\.html["']/g, 'void 0');
      html = html.replace(/location\.replace\(["']\/sandboxed\.html["']\)/g, 'void 0');
      html = html.replace(/\/sandboxed\.html/g, '');

      // 2. Mock ancestorOrigins to simulate AMP container bypass
      html = html.replace(
        /window\.location\.ancestorOrigins/g,
        '["https://cdn.ampproject.org"]'
      );

      // 3. Prevent top frame-busting
      html = html.replace(/top\.location/g, 'window.location');
      html = html.replace(/window\.top\s*!==\s*window\.self/g, 'false');
    }

    // Inject base href so relative assets (CSS, JS, player skins) resolve correctly
    const baseHref = `${urlObj.protocol}//${urlObj.host}`;
    if (!html.includes('<base')) {
      html = html.replace(
        /<head[^>]*>/i,
        `$&<base href="${baseHref}/">`
      );
    }

    // Strip generic frame-busting scripts
    html = html.replace(
      /if\s*\(\s*(?:top|window\.top)\s*!==\s*(?:self|window\.self)\s*\)[^}]*}/gi,
      '/* unbusted */'
    );

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
      },
    });
  } catch (error: unknown) {
    console.error('Embed proxy error:', error);
    return new NextResponse('Failed to proxy stream embed', { status: 502 });
  }
}
