export function generateUniqueSixDigitNumber(): number[] {
  const digits = new Set<number>();

  while (digits.size < 6) {
    const digit = Math.floor(Math.random() * 10);
    digits.add(digit);
  }

  return Array.from(digits);
}
