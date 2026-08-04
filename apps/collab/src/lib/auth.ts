import { CredentialResponse } from '@react-oauth/google'

// Centralized, defensive handling of the stored Google credential.
//
// The credential is a Google ID token (a JWT) persisted in localStorage and
// replayed as `Authorization: Bearer <credential>` on REST/socket calls. Google
// ID tokens are short-lived (~1h), so we validate both the stored shape and the
// token expiry client-side and fail closed (clear + treat as logged out) instead
// of replaying an invalid/expired token or crashing the render on bad JSON.

const AUTH_STORAGE_KEY = 'auth'

/** Remove any stored credential. */
export function clearStoredAuth() {
	localStorage.removeItem(AUTH_STORAGE_KEY)
}

/** Decode the `exp` claim (seconds since epoch) from a JWT, or null if unreadable. */
function jwtExpirySeconds(token: string): number | null {
	const segments = token.split('.')
	if (segments.length !== 3) {
		return null
	}
	try {
		const payloadJson = atob(segments[1].replace(/-/g, '+').replace(/_/g, '/'))
		const payload = JSON.parse(payloadJson) as { exp?: unknown }
		return typeof payload.exp === 'number' ? payload.exp : null
	} catch {
		return null
	}
}

/** True when the token carries an `exp` claim that is in the past. */
function isTokenExpired(token: string): boolean {
	const exp = jwtExpirySeconds(token)
	if (exp === null) {
		return false
	}
	return exp * 1000 <= Date.now()
}

/**
 * Read and validate the stored credential.
 *
 * Returns the parsed credential when present, well-formed, and unexpired.
 * Otherwise clears the invalid value and returns null so callers can redirect
 * to /login. Never throws.
 */
export function getStoredUser(): CredentialResponse | null {
	const userStorage = localStorage.getItem(AUTH_STORAGE_KEY)
	if (!userStorage) {
		return null
	}

	let parsed: CredentialResponse
	try {
		parsed = JSON.parse(userStorage)
	} catch {
		clearStoredAuth()
		return null
	}

	const credential = parsed?.credential
	if (!credential) {
		clearStoredAuth()
		return null
	}

	if (isTokenExpired(credential)) {
		clearStoredAuth()
		return null
	}

	return parsed
}
