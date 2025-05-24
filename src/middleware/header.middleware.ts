import { IncomingMessage, ServerResponse } from 'http';

/**
 * Middleware to set the Content-Type header to application/json for all responses.
 */
export function headerMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  // 1. Content-Type: Ensures all responses are treated as JSON
  res.setHeader('Content-Type', 'application/json');

  // 2. Cache-Control: Essential for APIs to prevent clients/proxies from caching dynamic data.
  //    This aggressively tells all caches not to store the response.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');   // For HTTP/1.0 compatibility
  res.setHeader('Expires', '0');        // For HTTP/1.0 compatibility

  // 3. X-Content-Type-Options: Security - Prevents browsers from MIME-sniffing content types.
  //    This helps prevent XSS attacks where browsers might misinterpret a file.
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 4. X-Frame-Options: Security - Prevents clickjacking attacks by disallowing your site
  //    from being embedded in iframes on other domains.
  res.setHeader('X-Frame-Options', 'DENY');

  // 5. Referrer-Policy: Security - Controls how much referrer information is sent with requests.
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');

  // 6. CORS (Access-Control-Allow-Origin, etc.) headers.

  next();
}