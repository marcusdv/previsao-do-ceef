import { OpenWeatherDataType } from "@/types/openWeatherType";

const API_KEY = process.env.OPENWEATHER_API_KEY;

interface WeatherData {
  dt: number;
  pop: number; // Probability of precipitation (0-1)
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: { speed: number };
}

// Função para determinar o tempo de cache baseado no dia da semana
function shouldMakeApiRequest(): { shouldRequest: boolean; cacheTime: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado
  
  // ESTRATÉGIA INTELIGENTE DE CACHE:
  
  // Segunda a sexta (1-5): Cache de 24h
  // - Nestes dias, a API de 5 dias consegue retornar dados da próxima sexta-feira
  // - Cache mais curto para manter dados atualizados quando são úteis
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return { shouldRequest: true, cacheTime: 86400 }; // 24 horas
  }
  
  // Fim de semana (sábado e domingo): Cache de 72h  
  // - A API de 5 dias NÃO consegue alcançar a próxima sexta-feira
  // - Cache mais longo para evitar requisições desnecessárias
  // - Economiza chamadas da API que não trariam dados úteis
  return { shouldRequest: true, cacheTime: 259200 }; // 72 horas (3 dias)
}


/**
 * Busca a previsão do tempo para sexta-feira em uma localização específica (CEFE) utilizando a API do OpenWeather.
 *
 * - Utiliza coordenadas geográficas fixas (lat/lon) para a consulta.
 * - Monta a URL da API com os parâmetros necessários (incluindo unidade métrica e idioma português).
 * - Realiza a requisição HTTP para obter a previsão de 5 dias/3 horas.
 * - Filtra os dados retornados para obter apenas as previsões referentes à sexta-feira.
 *
 * @returns Um objeto contendo:
 *   - `allFriday`: array com todas as previsões para sexta-feira.
 *
 * @throws Lança um erro caso a requisição à API falhe.
 */
export async function getOpenweatherFridayForecast() {
  if (!API_KEY) {
    throw new Error("API key for OpenWeather is not set.");
  }

  // Verifica qual tempo de cache usar baseado no dia da semana
  const { cacheTime } = shouldMakeApiRequest();
  
  // Coordenadas fixas para CEE (Centro de Educação Física e Esporte da UFBA)
  const lat = -13.008085569770852;
  const lon = -38.51330742515813;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

  const response = await fetch(url, {
    // CACHE INTELIGENTE: Varia entre 24h (segunda-sexta) e 72h (fim de semana)
    // Segunda a sexta: 24h de cache (dados frescos quando possível obter sexta-feira)
    // Fim de semana: 72h de cache (evita requisições que não trarão dados úteis)
    next: { revalidate: cacheTime },

    // COMO FUNCIONA:
    // 1ª chamada: Faz requisição real à API OpenWeather → dados salvos no cache
    // 2ª-Nª chamada (próximas 24h): Usa dados do cache → SEM nova requisição à API
    // Após 24h: Cache expira → próxima chamada faz nova requisição à API
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar previsão: ${response.statusText}`);
  }
  const data = await response.json();
  // console.log("Dados da API:", data);

  // Filtra para sexta-feira (0=domingo, 5=sexta)
  const fridayForecasts = data.list.filter((item: WeatherData) => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === 5;
  });

  /**
   * Transforma um array de objetos `WeatherData` (`fridayForecasts`) em um array de objetos de dados meteorológicos padronizados (`StandardWeatherData`).
   * Cada objeto inclui a fonte ("OpenWeather"), data e hora formatadas, temperatura, descrição do tempo,
   * e campos reservados para probabilidade de chuva e velocidade do vento (não fornecidos pela API).
   *
   * @observação
   * O código utiliza o método `Array.prototype.map`, que retorna um novo array aplicando a função fornecida a cada elemento.
   * Portanto, não é necessário um `return` explícito no nível superior, pois o resultado do `map` é atribuído diretamente a `StandardWeatherData`.
   */
  const openweatherData: OpenWeatherDataType[] = fridayForecasts.map(
    (item: WeatherData) => ({
      fonte: "OpenWeather",
      dataHora: new Date(item.dt * 1000).toLocaleString("pt-BR", {
        timeZone: "America/Bahia",
      }),
      temperatura: item.main.temp.toFixed(0),
      descricao: item.weather[0].description,
      probabilidadeChuva: item.pop
        ? parseFloat((item.pop * 100).toFixed(2))
        : null, // Formatado com 2 casas decimais
      velocidadeVento: item.wind.speed
        ? parseFloat((item.wind.speed * 3.6).toFixed(0))
        : null,
    })
  );

  // Filtra apenas horários acima de 11h
  const filteredData = openweatherData.filter((item) => {
    const timePart = item.dataHora.split(", ")[1]; // Extrai "HH:MM:SS"
    const hour = parseInt(timePart.split(":")[0]); // Extrai a hora
    return hour >= 6 && hour <= 23; // Só horários >= 9h
  });

  return { openweatherData: filteredData };
}
