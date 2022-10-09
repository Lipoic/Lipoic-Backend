import { compare, hash } from 'bcrypt';

/**
 * Hash the password
 * @param password The plain text password
 * @returns The hash of the password
 */
export async function passwordHash(password: string): Promise<string> {
  const saltRounds = 10;

  return await hash(password, saltRounds);
}

/**
 * Verify the password with the hash
 * @param password The plain text password
 * @param hash The hash of the password
 * @returns True if the password is correct, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}
