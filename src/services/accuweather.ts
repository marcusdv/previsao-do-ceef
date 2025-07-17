import { AccuWeatherDataType } from "@/types/accuweatherType";

// Função para converter Fahrenheit para Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

export async function getAccuweatherFridayForecast() {
  // 1. Busca a previsão do tempo para a cidade de Salvador(ID 43080)
  // 2. Monta a URL da API com os parâmetros necessários (incluindo unidade métrica e idioma português).
  const url =
    "https://dataservice.accuweather.com/forecasts/v1/daily/5day/43080?apikey=fF1ECmDWhCh9T82l1N1KYt0XqqBykamR&language=pt-br&metric=false&details=true";

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache por 24 horas (86400 segundos)
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
        speed: friday.Day.Wind.Speed.Value,
        direction: friday.Day.Wind.Direction.English,
      },
    },
    night: {
      hasPrecipitation: friday.Night.HasPrecipitation,
      longPhrase: friday.Night.LongPhrase,
      precipitationProbability: friday.Night.PrecipitationProbability,
      thunderstormProbability: friday.Night.ThunderstormProbability,
      wind: {
        speed: friday.Night.Wind.Speed.Value,
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
