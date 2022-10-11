export const USER_LOCALES = ['en-US', 'zh-CN', 'zh-TW'];

/**
 * The user's locale code.
 * @see https://en.wikipedia.org/wiki/IETF_language_tag
 *
 * List of supported locales:
 * - en-US (English - United States)
 * - zh-CN (Simplified Chinese - China)
 * - zh-TW (Traditional Chinese - Taiwan)
 */
export type UserLocale = typeof USER_LOCALES[number];
