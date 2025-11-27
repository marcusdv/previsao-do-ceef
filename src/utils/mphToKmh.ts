/**
 * Converte velocidade de milhas por hora (mph) para quilômetros por hora (km/h)
 * @param mph - Velocidade em milhas por hora
 * @returns Velocidade em km/h arredondada
 */
export function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}