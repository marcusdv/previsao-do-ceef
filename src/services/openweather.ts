import { OpenWeatherDataType } from "@/types/openWeatherType";
import shouldMakeApiRequest from "@/utils/shouldMakeApiRequest";



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

/**
 * Busca a previsão do tempo para sexta-feira em uma localização específica (CEEF) utilizando a API do OpenWeather.
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
  console.log('🔍 [OpenWeather] Iniciando função...');
  
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  console.log('🔑 [OpenWeather] API Key exists:', !!API_KEY);
  console.log('🔑 [OpenWeather] First 10 chars:', API_KEY?.substring(0, 10));

  if (!API_KEY) {
    console.error('❌ [OpenWeather] API Key não encontrada no process.env');
    throw new Error("API key for OpenWeather is not set.");
  }

  const { cacheTime } = shouldMakeApiRequest();
  console.log('📊 [OpenWeather] Cache time:', cacheTime);

  // Coordenadas fixas para CEE (Centro de Educação Física e Esporte da UFBA)
  const lat = -13.008085569770852;
  const lon = -38.51330742515813;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
  console.log('🌐 [OpenWeather] URL:', url);

  try {
    console.log('📡 [OpenWeather] Fazendo requisição...');
    const response = await fetch(url, {
      // CACHE INTELIGENTE: Varia entre 12h (segunda-sexta) e 72h (fim de semana)
      // Segunda a sexta: 12h de cache (dados frescos quando possível obter sexta-feira)
      // Fim de semana: 72h de cache (evita requisições que não trarão dados úteis)
      next: { revalidate: cacheTime },

      // COMO FUNCIONA:
      // 1ª chamada: Faz requisição real à API OpenWeather → dados salvos no cache
      // 2ª-Nª chamada (próximas 12h): Usa dados do cache → SEM nova requisição à API
      // Após 12h: Cache expira → próxima chamada faz nova requisição à API
    });

    console.log('📡 [OpenWeather] Response status:', response.status);
    console.log('📡 [OpenWeather] Response ok:', response.ok);
    console.log('📡 [OpenWeather] Response statusText:', response.statusText);

    if (response.status === 401) {
      console.error('❌ [OpenWeather] Erro 401: API Key inválida ou expirada');
      throw new Error(`Erro 401: API Key inválida`);
    }

    if (response.status === 429) {
      console.error('❌ [OpenWeather] Erro 429: Limite da API excedido');
      throw new Error(`Erro 429: Limite da API excedido`);
    }

    if (response.status === 403) {
      console.error('❌ [OpenWeather] Erro 403: Acesso negado - verifique permissões da API key');
      throw new Error(`Erro 403: Acesso negado`);
    }
    
    if (!response.ok) {
      console.error(`❌ [OpenWeather] Erro ${response.status}: ${response.statusText}`);
      const errorText = await response.text();
      console.error('❌ [OpenWeather] Error body:', errorText);
      throw new Error(`Erro ao buscar previsão: ${response.statusText}`);
    }

    console.log('📋 [OpenWeather] Convertendo resposta para JSON...');
    const data = await response.json();
    console.log('📋 [OpenWeather] Dados recebidos:', !!data);
    console.log('📋 [OpenWeather] List length:', data?.list?.length);
    console.log('📋 [OpenWeather] Primeira previsão:', data?.list?.[0]?.dt_txt);

    // Filtra para sexta-feira (0=domingo, 5=sexta)
    console.log('🗓️ [OpenWeather] Filtrando dados para sexta-feira...');
    const fridayForecasts = data.list.filter((item: WeatherData) => {
      const date = new Date(item.dt * 1000);
      const dayOfWeek = date.getDay();
      console.log('🗓️ [OpenWeather] Verificando:', date.toISOString(), 'Dia da semana:', dayOfWeek);
      return dayOfWeek === 5;
    });

    console.log('📅 [OpenWeather] Previsões de sexta-feira encontradas:', fridayForecasts.length);

    /**
     * Transforma um array de objetos `WeatherData` (`fridayForecasts`) em um array de objetos de dados meteorológicos padronizados (`StandardWeatherData`).
     * Cada objeto inclui a fonte ("OpenWeather"), data e hora formatadas, temperatura, descrição do tempo,
     * e campos reservados para probabilidade de chuva e velocidade do vento (não fornecidos pela API).
     *
     * @observação
     * O código utiliza o método `Array.prototype.map`, que retorna um novo array aplicando a função fornecida a cada elemento.
     * Portanto, não é necessário um `return` explícito no nível superior, pois o resultado do `map` é atribuído diretamente a `StandardWeatherData`.
     */
    console.log('🔄 [OpenWeather] Processando dados das previsões...');
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
    console.log('⏰ [OpenWeather] Filtrando horários (6h às 23h)...');
    const filteredData = openweatherData.filter((item) => {
      const timePart = item.dataHora.split(", ")[1]; // Extrai "HH:MM:SS"
      const hour = parseInt(timePart.split(":")[0]); // Extrai a hora
      console.log('⏰ [OpenWeather] Verificando horário:', hour);
      return hour >= 6 && hour <= 23; // Só horários >= 9h
    });

    console.log('✅ [OpenWeather] Dados filtrados finais:', filteredData.length);
    console.log('✅ [OpenWeather] Processamento concluído com sucesso!');

    return { openweatherData: filteredData };

  } catch (error) {
    console.error('❌ [OpenWeather] Erro geral na função:', error);
    console.error('❌ [OpenWeather] Stack trace:', (error as Error)?.stack);
    throw error; // Re-throw para manter comportamento original
  }
}
