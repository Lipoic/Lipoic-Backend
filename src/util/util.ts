/**
 * Get the values of an enum as an array of strings.
 * @param e The enum
 * @returns The values of the enum as an array of strings.
 */
export function getEnumValues<T extends object>(e: T): string[] {
  return Object.values(e).filter((v) => typeof v === 'string');
}

/**
 * Get characters length of the string.
 * @param str The string
 * @returns The length of the string in characters.
 */
export function getCharactersLength(str: string): number {
  return [...str].length;
}
