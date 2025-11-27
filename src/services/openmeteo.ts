/**
 * Busca a previsão do tempo para sexta-feira utilizando a API do Open-Meteo.
 * Retorna horário, temperatura, descrição, chance de chuva, velocidade do vento e índice UV.
 */

import shouldMakeApiRequest from "@/utils/shouldMakeApiRequest";
import { addLog } from "@/app/api/logs/route";

interface ForecastItem {
  datetime: Date;
  temperatura: number;
  probabilidadeChuva: number;
  weather_code: number;
  velocidadeVento: number;
  indiceUV: number;
}

export async function getOpenMeteoFridayForecast(dayOfWeek: number) {
  const { cacheTime } = shouldMakeApiRequest();

  const lat = -13.008085569770852;
  const lon = -38.51330742515813;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&timezone=America/Bahia&forecast_days=7`;

  try {
    const response = await fetch(url, {
      next: { revalidate: cacheTime }, 
    });

    addLog('info', '[OpenMeteo] Response status', { status: response.status });

    if (!response.ok) {
      addLog('error', '[OpenMeteo] Erro na API', { status: response.status, statusText: response.statusText });
      throw new Error(`Erro ao buscar previsão Open-Meteo: ${response.statusText}`);
    }

    const data = await response.json();

  // Mapeia códigos meteorológicos para descrição
  const weatherCodeDescriptions: { [key: number]: string } = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa forte",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    80: "Pancadas de chuva leves",
    81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva fortes",
    95: "Tempestade",
    96: "Tempestade com granizo leve",
    99: "Tempestade com granizo forte",
  };

  const fridayForecasts = data.hourly.time
    .map((time: string, index: number): ForecastItem => {
      const date = new Date(time);
      return {
        datetime: date,
        temperatura: data.hourly.temperature_2m[index],
        probabilidadeChuva: data.hourly.precipitation_probability[index],
        weather_code: data.hourly.weather_code[index],
        velocidadeVento: data.hourly.wind_speed_10m[index],
        indiceUV: data.hourly.uv_index[index],
      };
    })
    .filter((item: ForecastItem) => item.datetime.getDay() === dayOfWeek)
    .filter((item: ForecastItem) => {
      // Converte para string e extrai a hora diretamente
      const timeString = item.datetime.toLocaleString("pt-BR", {
        timeZone: "America/Bahia",
        hour: "2-digit",
        hour12: false,
      });
      const hour = parseInt(timeString);
      return hour >= 12 && hour <= 19;
    });


  const openMeteoData = fridayForecasts.map((item: ForecastItem) => ({
    fonte: "Open-Meteo",
    dataHora: item.datetime.toLocaleString("pt-BR", {
      timeZone: "America/Bahia",
    }),
    temperatura: item.temperatura ? item.temperatura.toFixed(0) : null,
    descricao:
      weatherCodeDescriptions[item.weather_code] || "Condição desconhecida",
    probabilidadeChuva: item.probabilidadeChuva || 0,
    velocidadeVento: item.velocidadeVento
      ? item.velocidadeVento.toFixed(0)
      : null,
    indiceUV: item.indiceUV !== undefined ? item.indiceUV : null,
  }));

  addLog('success', '[OpenMeteo] Dados processados com sucesso', { totalForecasts: openMeteoData.length });

  return { openMeteoData};
  } catch (error) {
    addLog('error', '[OpenMeteo] Erro inesperado', { error: String(error) });
    throw error;
  }
}

export type OpenMeteoDataType = {
  fonte: "Open-Meteo";
  dataHora: string; // Formato "DD/MM/YYYY, HH:MM:SS"
  temperatura: string | null; // Temperatura em °C
  descricao: string; // Descrição do tempo
  probabilidadeChuva: number; // Probabilidade de chuva em %
  velocidadeVento: string | null; // Velocidade do vento em km/h
  indiceUV: number | null; // Índice UV
};
