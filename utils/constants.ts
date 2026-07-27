export const OAUTH = {
    GOOGLE_OAUTH: "oauth_google",
    GITHUB_OAUTH: "oauth_github",
    APPLE_OAUTH: "oauth_apple"
} as const;

export type OAuthStrategy = typeof OAUTH[keyof typeof OAUTH];


