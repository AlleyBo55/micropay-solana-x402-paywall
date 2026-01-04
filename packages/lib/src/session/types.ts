// Session-related types

/** Session data stored in JWT */
export interface SessionData {
    /** Unique session ID */
    id: string;
    /** Wallet address that paid */
    walletAddress: string;
    /** Array of unlocked article IDs */
    unlockedArticles: string[];
    /** Whether site-wide access is granted */
    siteWideUnlock: boolean;
    /** Unix timestamp of creation */
    createdAt: number;
    /** Unix timestamp of expiration */
    expiresAt: number;
}

/** Session configuration options */
export interface SessionConfig {
    /** Session duration in hours */
    durationHours: number;
    /** Secret key for JWT signing (min 32 chars) */
    secret: string;
}

/** Result of session validation */
export interface SessionValidation {
    /** Whether the session is valid */
    valid: boolean;
    /** Parsed session data if valid */
    session?: SessionData;
    /** Reason for invalid session */
    reason?: string;
}

/** JWT payload structure for sessions */
export interface SessionJWTPayload {
    /** Wallet address (subject) */
    sub: string;
    /** Session ID */
    sid: string;
    /** Unlocked article IDs */
    articles: string[];
    /** Site-wide unlock flag */
    siteWide: boolean;
    /** Issued at timestamp */
    iat: number;
    /** Expiration timestamp */
    exp: number;
}
