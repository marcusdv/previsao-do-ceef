/**
 * Busca previsão do tempo da AccuWeather para o dia especificado
 * @param dayOfWeek - Dia da semana (5 = sexta-feira, 6 = sábado)
 * @returns Objeto com accuweatherData ou null em caso de erro
 */
export async function getAccuweatherFridayForecast(dayOfWeek: number = 5) {
  try {
    // Envia parâmetro via query string: /api/weather/accuweather?day=5 ou ?day=6
    // Sem cache: 'no-store' para permitir cache do navegador
    const response = await fetch(`/api/weather/accuweather?day=${dayOfWeek}`);

    if (!response.ok) {
      return { accuweatherData: null };
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('❌ [AccuWeather] Failed to fetch:', error);
    return { accuweatherData: null };
  }
}