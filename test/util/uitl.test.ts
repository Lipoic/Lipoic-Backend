import { getEnumValues } from '@/util/util';
import { describe, expect, test } from 'vitest';

describe('Get the values of an enum as an array of strings', () => {
  test('Normal enum', () => {
    enum Foo {
      A,
      B,
      C,
    }

    const result = getEnumValues(Foo);

    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('Enum with custom value', () => {
    enum Foo {
      A = 'B',
      B = 'C',
      C = 'D',
    }

    const result = getEnumValues(Foo);

    expect(result).toEqual(['B', 'C', 'D']);
  });

  test('Enum with number value', () => {
    enum Foo {
      A = 1,
      B = 2,
      C = 3,
    }

    const result = getEnumValues(Foo);

    expect(result).toEqual(['A', 'B', 'C']);
  });
});
