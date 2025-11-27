/**
 * Converte temperatura de Fahrenheit para Celsius
 * @param fahrenheit - Temperatura em graus Fahrenheit
 * @returns Temperatura em graus Celsius arredondada
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}