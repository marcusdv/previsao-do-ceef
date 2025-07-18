import { AccuWeatherDataType } from "@/types/accuweatherType";

// Função para converter Fahrenheit para Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

// Função para converter mph para km/h
function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}

// Função para determinar o tempo de cache baseado no dia da semana
function shouldMakeApiRequest(): { shouldRequest: boolean; cacheTime: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado
  
  // ESTRATÉGIA INTELIGENTE DE CACHE:
  
  // Segunda a sexta (1-5): Cache de 12h
  // - Nestes dias, a API de 5 dias consegue retornar dados da próxima sexta-feira
  // - Cache mais curto para manter dados atualizados quando são úteis
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return { shouldRequest: true, cacheTime: 1  }; // 12 horas
  }
  
  // Fim de semana (sábado e domingo): Cache de 72h  
  // - A API de 5 dias NÃO consegue alcançar a próxima sexta-feira
  // - Cache mais longo para evitar requisições desnecessárias
  // - Economiza chamadas da API que não trariam dados úteis
  return { shouldRequest: true, cacheTime: 259200 }; // 72 horas (3 dias)
}

export async function getAccuweatherFridayForecast() {
  // Determina a estratégia de cache baseada no dia da semana
  const { cacheTime } = shouldMakeApiRequest();
  
  // 1. Busca a previsão do tempo para a cidade de Salvador(ID 43080)
  // 2. Monta a URL da API com os parâmetros necessários (incluindo unidade métrica e idioma português).
  const url =
    "https://dataservice.accuweather.com/forecasts/v1/daily/5day/43080?apikey=fF1ECmDWhCh9T82l1N1KYt0XqqBykamR&language=pt-br&metric=false&details=true";

  const response = await fetch(url, {
    next: { revalidate: cacheTime }, // Cache dinâmico baseado no dia da semana
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar previsão: ${response.statusText}`);
  }

  // 3. Converte a resposta JSON em um objeto JavaScript
  const data = await response.json();

  const friday = data.DailyForecasts.find((d: { Date: string }) => {
    console.log("Data da previsão:", d.Date); // d.Date é uma string como "2025-07-16T07:00:00-03:00"
    const date = new Date(d.Date);
    return date.getDay() === 5; // 5 = sexta-feira
  });

  // 4. Se não encontrar previsão para sexta-feira, retorna null
  if (!friday) {
    return { accuweatherData: null }; 
  }

  console.log("Dados brutos da sexta-feira:", friday);

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
