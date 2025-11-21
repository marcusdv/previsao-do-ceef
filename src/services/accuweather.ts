import { AccuWeatherDataType } from "@/types/accuweatherType";
import shouldMakeApiRequest from "@/utils/shouldMakeApiRequest";

// Função para converter Fahrenheit para Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

// Função para converter mph para km/h
function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}

export async function getAccuweatherFridayForecast() {
  // Determina a estratégia de cache baseada no dia da semana
  const { cacheTime } = shouldMakeApiRequest();

  // 1. Busca a previsão do tempo para a cidade de Salvador(ID 43080)
  // 2. Monta a URL da API com os parâmetros necessários (incluindo unidade métrica e idioma português).
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  const url =
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/43080?apikey=${apiKey}&language=pt-br&metric=false&details=true`;
  console.log('AccuWeather API Key exists:', !!apiKey);
  console.log('First 10 chars:', apiKey?.substring(0, 10));

  const response = await fetch(url, {
    next: { revalidate: cacheTime }, // Cache dinâmico baseado no dia da semana
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar previsão: ${response.statusText}`);
  }

  // 3. Converte a resposta JSON em um objeto JavaScript
  const data = await response.json();

  const friday = data.DailyForecasts.find((d: { Date: string }) => {
    const date = new Date(d.Date);
    return date.getDay() === 5; // 5 = sexta-feira
  });

  // 4. Se não encontrar previsão para sexta-feira, retorna null
  if (!friday) {
    return { accuweatherData: null };
  }


  const accuweatherData: AccuWeatherDataType = {
    date: friday.Date,
    temperature: {
      max: fahrenheitToCelsius(friday.Temperature.Maximum.Value),
      min: fahrenheitToCelsius(friday.Temperature.Minimum.Value),
    },
    realFeelTemperature: {
      max: fahrenheitToCelsius(friday.RealFeelTemperature.Maximum.Value),
      min: fahrenheitToCelsius(friday.RealFeelTemperature.Minimum.Value),
    },
    day: {
      hasPrecipitation: friday.Day.HasPrecipitation,
      longPhrase: friday.Day.LongPhrase,
      precipitationProbability: friday.Day.PrecipitationProbability,
      thunderstormProbability: friday.Day.ThunderstormProbability,
      wind: {
        speed: mphToKmh(friday.Day.Wind.Speed.Value),
        direction: friday.Day.Wind.Direction.English,
      },
    },
    night: {
      hasPrecipitation: friday.Night.HasPrecipitation,
      longPhrase: friday.Night.LongPhrase,
      precipitationProbability: friday.Night.PrecipitationProbability,
      thunderstormProbability: friday.Night.ThunderstormProbability,
      wind: {
        speed: mphToKmh(friday.Night.Wind.Speed.Value),
        direction: friday.Night.Wind.Direction.English,
      },
    },
    sun: {
      Rise: friday.Sun.Rise,
      Set: friday.Sun.Set,
    },
    moon: {
      Rise: friday.Moon.Rise,
      Set: friday.Moon.Set,
      Phase: friday.Moon.Phase,
      Age: friday.Moon.Age,
    },
  };


  return { accuweatherData };
}
