// Função para converter Fahrenheit para Celsius
export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}