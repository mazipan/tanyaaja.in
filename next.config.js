const CSP_ALLOWED_DOMAINS = [
  '*.google.com',
  '*.googletagmanager.com',
  '*.googleapis.com',
  '*.gstatic.com',
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
]

const CSP_ALLOWED_DOMAINS_STRING = CSP_ALLOWED_DOMAINS.filter(Boolean).join(' ')

/**
 * Ideally we are not allowing 'unsafe-eval' 'unsafe-inline'
 * But since it's too complicated for now, we just allow it for now
 *
 * TODO: Explore about using "nonce" attribute so we are not using "unsafe-" anymore
 * Refs:
 * - https://web.dev/strict-csp/
 * - https://developers.google.com/tag-platform/tag-manager/csp?hl=id
 * - https://dev.to/snaka/securing-your-nextjs-application-with-strict-csp-4lie
 */
const CSP_POLICIES = `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${CSP_ALLOWED_DOMAINS_STRING}; object-src 'self' blob: ${CSP_ALLOWED_DOMAINS_STRING}; worker-src 'self' blob: ${CSP_ALLOWED_DOMAINS_STRING};`

// Refs: https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md
const PERMISSION_FATURES = [
  'autoplay',

  'clipboard-read',
  'clipboard-write',

  'fullscreen',
  'idle-detection',
  'picture-in-picture',

  'interest-cohort',
]

const PERMISSION_POLICIES = `${PERMISSION_FATURES.join('=*, ')}=*`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: CSP_POLICIES,
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'sameorigin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'same-origin',
  },
  {
    key: 'Permissions-Policy',
    value: PERMISSION_POLICIES,
  },
  {
    key: 'Service-Worker-Allowed',
    value: '/',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
