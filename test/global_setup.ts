import { generateSwaggerFile } from '@/util/swagger';

/**
 * Global setup for Vitest to run before all tests.
 */
export default function () {
  generateSwaggerFile();
}
