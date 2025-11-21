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
  console.log('🔍 [AccuWeather] Iniciando função...');
  
  // Determina a estratégia de cache baseada no dia da semana
  const { cacheTime } = shouldMakeApiRequest();
  console.log('📊 [AccuWeather] Cache time:', cacheTime);

  // 1. Busca a previsão do tempo para a cidade de Salvador(ID 43080)
  // 2. Monta a URL da API com os parâmetros necessários (incluindo unidade métrica e idioma português).
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  console.log('🔑 [AccuWeather] API Key exists:', !!apiKey);
  console.log('🔑 [AccuWeather] First 10 chars:', apiKey?.substring(0, 10));
  
  if (!apiKey) {
    console.error('❌ [AccuWeather] API Key não encontrada no process.env');
    return { accuweatherData: null };
  }

  const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/43080?apikey=${apiKey}&language=pt-br&metric=false&details=true`;
  console.log('🌐 [AccuWeather] URL:', url);

  try {
    console.log('📡 [AccuWeather] Fazendo requisição...');
    const response = await fetch(url, {
      next: { revalidate: cacheTime }, // Cache dinâmico baseado no dia da semana
    });

    console.log('📡 [AccuWeather] Response status:', response.status);
    console.log('📡 [AccuWeather] Response ok:', response.ok);
    console.log('📡 [AccuWeather] Response statusText:', response.statusText);

    if (response.status === 401) {
      console.error('❌ [AccuWeather] Erro 401: API Key inválida ou expirada');
      return { accuweatherData: null };
    }

    if (response.status === 429) {
      console.error('❌ [AccuWeather] Erro 429: Limite da API excedido');
      return { accuweatherData: null };
    }

    if (response.status === 403) {
      console.error('❌ [AccuWeather] Erro 403: Acesso negado - verifique permissões da API key');
      return { accuweatherData: null };
    }

    if (!response.ok) {
      console.error(`❌ [AccuWeather] Erro ${response.status}: ${response.statusText}`);
      const errorText = await response.text();
      console.error('❌ [AccuWeather] Error body:', errorText);
      return { accuweatherData: null };
    }

    // 3. Converte a resposta JSON em um objeto JavaScript
    console.log('📋 [AccuWeather] Convertendo resposta para JSON...');
    const data = await response.json();
    console.log('📋 [AccuWeather] Dados recebidos:', !!data);
    console.log('📋 [AccuWeather] DailyForecasts length:', data?.DailyForecasts?.length);
    console.log('📋 [AccuWeather] Primeira data:', data?.DailyForecasts?.[0]?.Date);

    const friday = data.DailyForecasts.find((d: { Date: string }) => {
      const date = new Date(d.Date);
      console.log('🗓️ [AccuWeather] Verificando data:', d.Date, 'Dia da semana:', date.getDay());
      return date.getDay() === 5; // 5 = sexta-feira
    });

    console.log('📅 [AccuWeather] Sexta-feira encontrada:', !!friday);

    // 4. Se não encontrar previsão para sexta-feira, retorna null
    if (!friday) {
      console.log('❌ [AccuWeather] Nenhuma sexta-feira encontrada no array de previsões');
      return { accuweatherData: null };
    }

    console.log('✅ [AccuWeather] Processando dados da sexta-feira...');

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

    console.log('✅ [AccuWeather] Dados processados com sucesso!');
    return { accuweatherData };

  } catch (error) {
    console.error('❌ [AccuWeather] Erro geral na função:', error);
    console.error('❌ [AccuWeather] Stack trace:', (error as Error)?.stack);
    return { accuweatherData: null };
  }
}
