import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

const ALLOWED_DOMAINS = [
  'images.triel.sk',
  // Add other vendor image domains here
];

function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some((domain) => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
}

// Create HTTPS agent that allows self-signed certificates in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === 'production',
});

async function fetchImage(url: string): Promise<{ buffer: Buffer; contentType: string; statusCode: number }> {
  // Use https.get directly for better SSL certificate control
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'TeleTrade-Hub-ImageProxy/1.0',
      },
      agent: httpsAgent,
    };

    const req = https.get(options, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location;
        if (location) {
          req.destroy();
          return fetchImage(location).then(resolve).catch(reject);
        }
      }

      const chunks: Buffer[] = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          contentType: res.headers['content-type'] || 'image/jpeg',
          statusCode: res.statusCode || 200,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/');
    const imageUrl = decodeURIComponent(imagePath);

    // Validate URL (security check)
    if (!isValidImageUrl(imageUrl)) {
      return new NextResponse('Invalid image URL', { status: 400 });
    }

    // Fetch image from vendor using custom HTTPS agent
    const { buffer, contentType, statusCode } = await fetchImage(imageUrl);

    if (statusCode !== 200) {
      return new NextResponse('Image not found', { status: statusCode || 404 });
    }

    // Return proxied image
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}

