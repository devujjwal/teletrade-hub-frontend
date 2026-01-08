# Frontend Security Notes

## Token Storage Security

### Current Implementation: localStorage
**Location:** `lib/store/auth-store.ts`

**Security Considerations:**
- Tokens are stored in `localStorage` which is accessible to JavaScript
- Vulnerable to XSS attacks if malicious scripts execute
- Tokens persist across browser sessions

**Mitigations in Place:**
- React's automatic HTML escaping prevents most XSS attacks
- Content Security Policy headers reduce XSS risk
- Input sanitization utilities available
- Server-side validation enforces security

**Future Improvements:**
- Consider httpOnly cookies for token storage (requires backend changes)
- Implement token refresh mechanism
- Add token expiration handling
- Consider using secure, httpOnly cookies with SameSite attribute

## XSS Prevention

### React's Built-in Protection
React automatically escapes content in JSX, preventing most XSS attacks:
```tsx
// Safe - React escapes HTML
<span>{user.name}</span>

// Safe - React escapes HTML
<p>{product.description}</p>
```

### Sanitization Utilities
**Location:** `lib/utils/sanitize.ts`

Utilities available for:
- HTML sanitization
- URL sanitization
- Redirect URL validation
- User input sanitization

**Usage:**
```tsx
import { sanitizeUserInput, validateRedirectUrl } from '@/lib/utils/sanitize';

// Sanitize user input
const safeName = sanitizeUserInput(user.name);

// Validate redirect URLs
const safeUrl = validateRedirectUrl(userProvidedUrl);
```

## Security Headers

**Location:** `next.config.js`

Security headers implemented:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy
- Referrer-Policy
- Permissions-Policy

## Input Validation

**Location:** `lib/utils/validation.ts`

All forms use Zod schemas for validation:
- Email validation
- Password strength (registration)
- Address validation
- Phone number validation

**Note:** Server-side validation is the primary security layer. Client-side validation improves UX but should not be relied upon for security.

## Redirect Security

All redirects use:
- Hardcoded relative paths (safe)
- Next.js router.push() for internal navigation
- URL validation utilities for dynamic redirects

**Safe Redirects:**
- `router.push('/account')` - Hardcoded path
- `router.push('/admin/login')` - Hardcoded path
- `router.push(\`/orders/\${orderNumber}\`)` - Order number from API

## API Security

**Location:** `lib/api/client.ts`

**Security Features:**
- Bearer token authentication
- Error message sanitization in production
- HTTPS enforcement in production
- Request/response interceptors

**Error Handling:**
- Production: Generic error messages
- Development: Detailed error messages
- Prevents information disclosure

## Environment Variables

**Safe Usage:**
- `NEXT_PUBLIC_API_URL` - Public API URL (safe to expose)
- No sensitive keys in frontend code
- All secrets handled server-side

## Dependency Security

**Current Status:**
- `eslint-config-next@14.2.0` has high severity vulnerability
- Requires ESLint 9 migration (breaking change)
- Vulnerability is in dev dependencies only (low production risk)

**Recommendation:**
- Plan ESLint 9 migration for future update
- Monitor for security advisories
- Regular dependency audits

## Best Practices

1. **Never trust client-side validation alone**
   - Always validate on server
   - Client-side validation improves UX only

2. **Sanitize all user input**
   - Use React's automatic escaping
   - Use sanitization utilities when needed
   - Validate URLs before redirects

3. **Secure token storage**
   - Consider httpOnly cookies
   - Implement token refresh
   - Handle token expiration

4. **Error handling**
   - Don't expose sensitive information
   - Use generic messages in production
   - Log errors server-side

5. **Security headers**
   - Keep security headers up to date
   - Review CSP policies regularly
   - Test header enforcement

