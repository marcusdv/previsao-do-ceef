// Service que faz requisição para a API Route local do Next.js
// Este arquivo roda no CLIENT-SIDE e chama a rota /api/weather/accuweather
// A API Route (route.ts) é quem faz a requisição real para AccuWeather no servidor

import { AccuWeatherDataType } from "@/types/accuweatherType";

/**
 * Função que busca a previsão do tempo da AccuWeather para sexta-feira
 * Chama a API Route interna do Next.js ao invés de chamar diretamente a API externa
 * Isso resolve problemas de CORS e mantém a API key segura
 */
export async function getAccuweatherFridayForecast() {
  try {
    // Faz requisição para a API Route local (roda no servidor Next.js)
    const response = await fetch('/api/weather/accuweather', {
      cache: 'no-store' // Não cacheia no cliente, sempre busca dados frescos
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      console.error('❌ [AccuWeather] Erro:', response.status);
      return { accuweatherData: null }; // Retorna null em caso de erro
    }

    // Parseia a resposta JSON
    const data = await response.json();
    return data; // Retorna os dados { accuweatherData: AccuWeatherDataType | null }

  } catch (error) {
    // Captura erros de rede ou parsing
    console.error('❌ [AccuWeather] Failed to fetch:', error);
    return { accuweatherData: null }; // Retorna null em caso de erro
  }
}