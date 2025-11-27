export async function getAccuweatherFridayForecast(dayOfWeek: number = 5) {
  try {
    // Aqui você ENVIA o parâmetro via query string na URL
    const response = await fetch(`/api/weather/accuweather?day=${dayOfWeek}`, {
      //                                                    ↑
      //                             Parâmetro vira ?day=5 ou ?day=6
      cache: 'no-store'
    });

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