import { getCharactersLength, getEnumValues } from '@/util/util';
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

describe('Get characters length of the string', () => {
  test('Hello world', () => {
    const result = getCharactersLength('Hello, world!');

    expect(result).toBe(13);
  });

  test('Emoji', () => {
    const result = getCharactersLength('👋🌍');
    expect(result).toBe(2);
  });

  test('Emoji with skin tone', () => {
    const result = getCharactersLength('👋🏻🌍');
    expect(result).toBe(3);
  });

  test('Chinese', () => {
    const result = getCharactersLength('你好，世界！');
    expect(result).toBe(6);
  });

  test('Japanese', () => {
    const result = getCharactersLength('こんにちは世界！');
    expect(result).toBe(8);
  });

  test('Special characters', () => {
    const result = getCharactersLength('!@#$%^&*()_+');
    expect(result).toBe(12);
  });
});
