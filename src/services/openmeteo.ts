/**
 * Busca a previsão do tempo para sexta-feira utilizando a API do Open-Meteo.
 * Retorna horário, temperatura, descrição, chance de chuva, velocidade do vento e índice UV.
 */

import shouldMakeApiRequest from "@/utils/shouldMakeApiRequest";

interface ForecastItem {
  datetime: Date;
  temperatura: number;
  probabilidadeChuva: number;
  weather_code: number;
  velocidadeVento: number;
  indiceUV: number;
}

export async function getOpenMeteoFridayForecast() {
  const { cacheTime } = shouldMakeApiRequest();

  const lat = -13.008085569770852;
  const lon = -38.51330742515813;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&timezone=America/Bahia&forecast_days=7`;

  const response = await fetch(url, {
    next: { revalidate: cacheTime }, // Cache de 12h
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar previsão Open-Meteo: ${response.statusText}`
    );
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

  // Filtra para sexta-feira e horários entre 12h e 19h
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
    .filter((item: ForecastItem) => item.datetime.getDay() === 5)
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

  // Filtra para sábado e horários entre 9h e 16h
  const saturdayForecasts = data.hourly.time
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
    .filter((item: ForecastItem) => item.datetime.getDay() === 6)
    .filter((item: ForecastItem) => {
      // Converte para string e extrai a hora diretamente
      const timeString = item.datetime.toLocaleString("pt-BR", {
        timeZone: "America/Bahia",
        hour: "2-digit",
        hour12: false,
      });
      const hour = parseInt(timeString);
      return hour >= 9 && hour <= 16;
    });


  // ! tentativa para sábado
  const openMeteoDataSaturday = saturdayForecasts.map((item: ForecastItem) => ({
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

  return { openMeteoData, openMeteoDataSaturday};
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
