import { OpenMeteoDataType } from "@/services/openmeteo";

interface Props {
  data: OpenMeteoDataType[] | null; // Permite que os dados sejam nulos
  className?: string;
}

export default function OpenMeteoCard({ data, className }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 ${className}`}>
        <h3 className="text-xl font-bold text-gray-800">OpenMeteo</h3>
        <p>Dados não disponíveis</p>
      </div>
    );
  }

  const getWeatherIcon = (description: string, probabilidadeChuva: number = 0) => {
    const desc = description.toLowerCase();

    // Se a probabilidade de chuva for baixa (menos de 40%), priorize ícones mais positivos
    if (probabilidadeChuva < 40) {
      if (desc.includes('limpo') || desc.includes('céu limpo')) return '☀️';
      if (desc.includes('nuvem') || desc.includes('nublado')) return '🌤️'; // Parcialmente nublado (mais otimista)
      if (desc.includes('chuva') || desc.includes('garoa')) return '⛅'; // Sol com algumas nuvens
      return '🌤️'; // Padrão otimista
    }

    // Para probabilidades altas (40% ou mais), mantenha os ícones originais
    if (desc.includes('tempestade')) return '⛈️';
    if (desc.includes('chuva') || desc.includes('garoa')) return '🌧️';
    if (desc.includes('nuvem') || desc.includes('nublado')) return '☁️';
    if (desc.includes('limpo') || desc.includes('céu limpo')) return '☀️';
    if (desc.includes('neblina')) return '🌫️';
    return '🌤️';
  };

  const formatTime = (dateTime: string) => {
    const timePart = dateTime.split(', ')[1];
    return timePart ? timePart.substring(0, 5) : '00:00';
  };

  // Calcular média de temperatura
  const avgTemp = Math.round(
    data.reduce((sum, item) => sum + parseFloat(String(item.temperatura || "0")), 0) / data.length
  );

  // Calcular probabilidade máxima de chuva
  const maxRain = Math.max(...data.map(item => item.probabilidadeChuva || 0));

  // Calcular velocidade média do vento
  const avgWind = Math.round(
    data.reduce((sum, item) => sum + parseFloat(String(item.velocidadeVento || "0")), 0) / data.length
  );

  // Calcular índice UV médio entre 13h e 16h
  const uvData13to16 = data.filter(item => {
    const hour = parseInt(formatTime(item.dataHora).split(':')[0]);
    return hour >= 13 && hour <= 16;
  });
  const avgUV = uvData13to16.length > 0
    ? uvData13to16.reduce((sum, item) => sum + (item.indiceUV || 0), 0) / uvData13to16.length
    : 0;

  // Função para classificar UV e dar recomendações
  const getUVInfo = (uvIndex: number) => {
    if (uvIndex <= 2) {
      return {
        nivel: "Baixo",
        cor: "text-green-600",
        recomendacao: "Mínimo risco. Protetor solar (FPS 15+) opcional, mas recomendado para peles sensíveis."
      };
    } else if (uvIndex <= 5) {
      return {
        nivel: "Moderado",
        cor: "text-yellow-600",
        recomendacao: "Use protetor solar (FPS 30+). Evite muita exposição direta entre 10h e 16h."
      };
    } else if (uvIndex <= 7) {
      return {
        nivel: "Alto",
        cor: "text-orange-600",
        recomendacao: "Alto risco! Protetor solar (FPS 30+), roupas protetoras, sombra e evitar sol no horário de pico."
      };
    } else if (uvIndex <= 10) {
      return {
        nivel: "Muito Alto",
        cor: "text-red-600",
        recomendacao: "Queimaduras graves em 15-25 min. Proteção máxima: FPS 50+, roupas com proteção UV."
      };
    } else {
      return {
        nivel: "Extremo",
        cor: "text-purple-600",
        recomendacao: "PERIGO! Evite ao máximo a exposição ao sol. Use todas as proteções possíveis."
      };
    }
  };

  // Função para classificar vento e dar informações sobre o impacto no vôlei
  const getWindInfo = (windSpeed: number) => {
    if (windSpeed <= 5) {
      return {
        nivel: "Calmaria",
        cor: "text-green-600",
        efeito: "Sem efeito perceptível na bola.",
        icone: "🌬️"
      };
    } else if (windSpeed <= 15) {
      return {
        nivel: "Vento Fraco",
        cor: "text-blue-600",
        efeito: "Pouco efeito, pode desviar levemente bolas altas.",
        icone: "💨"
      };
    } else if (windSpeed <= 25) {
      return {
        nivel: "Vento Moderado",
        cor: "text-yellow-600",
        efeito: "Pode atrapalhar saques, passes e levantamentos.",
        icone: "💨"
      };
    } else if (windSpeed <= 35) {
      return {
        nivel: "Vento Forte",
        cor: "text-orange-600",
        efeito: "Dificulta controle da bola, aumenta erros e desvios.",
        icone: "🌬️"
      };
    } else {
      return {
        nivel: "Muito Forte",
        cor: "text-red-600",
        efeito: "Jogo prejudicado, difícil manter precisão e segurança.",
        icone: "🌪️"
      };
    }
  };

  const uvInfo = getUVInfo(avgUV);
  const windInfo = getWindInfo(avgWind);



  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">OpenMeteo</h3>
        <div className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm font-medium">
          API Gratuita
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {/* Temperatura Média */}
        <div className="text-center p-3 bg-teal-50 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Temp. Média</h4>
          <p className="text-lg md:text-2xl font-bold text-teal-600">{avgTemp}°C</p>
        </div>

        {/* Máx. Chuva */}
        <div className="text-center p-3 bg-cyan-50 rounded-lg">
          <h4 className="text-xs md:text-smfont-medium text-gray-600 mb-1">Máx. Chuva</h4>
          <p className="text-lg md:text-2xl font-bold text-cyan-600">{maxRain}%</p>
        </div>

        {/* Vento Médio */}
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Vento Médio</h4>
          <p className="text-md md:text-2xl font-bold text-indigo-600">{avgWind} km/h</p>
        </div>

        {/* UV Médio */}
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">UV médio</h4>
          <p className="text-lg md:text-2xl font-bold text-amber-600">{avgUV.toFixed(1)}</p>
        </div>
      </div>

      {/* Previsão por Horário */}
      <div className="mb-6">
        <h5 className="font-semibold text-gray-800 mb-3">📅 Previsão Horária (12h às 19h)</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 xxl:grid-cols-8 gap-2">
          {data.map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {formatTime(item.dataHora)}
              </div>
              <div className="text-xl mb-1">
                {getWeatherIcon(item.descricao, item.probabilidadeChuva || 0)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                {item.temperatura}°C
              </div>
              <div className="text-xs text-cyan-600">
                💧 {item.probabilidadeChuva}%
              </div>
              <div className="text-xs text-indigo-600">
                💨 {item.velocidadeVento} km/h
              </div>
              <div className="text-xs text-amber-600">
                ☀️ {item.indiceUV !== null ? item.indiceUV.toFixed(1) : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condições Gerais */}
      <div className="bg-teal-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">


          <h5 className="font-semibold text-gray-800 flex items-center">
            🌤️ Condições do Dia
          </h5>
        </div>
        <p className="text-sm text-gray-700 mb-3 capitalize">
          {data[0]?.descricao}
        </p>

        {/* Informações de UV */}
        <div className="flex items-center mb-2">
          <h6 className="font-semibold text-gray-800 mr-2">☀️ Índice UV:</h6>
          <span className={`font-bold ${uvInfo.cor}`}>
            {avgUV.toFixed(1)} - {uvInfo.nivel}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          {uvInfo.recomendacao}
        </p>

        {/* Informações do vento */}
        <div className="flex items-center mb-2">
          <h6 className="font-semibold text-gray-800 mr-2">{windInfo.icone} Vento:</h6>
          <span className={`font-bold ${windInfo.cor}`}>
            {avgWind} km/h - {windInfo.nivel}
          </span>
        </div>
        <p className="text-xs text-gray-600 break-words">
          {windInfo.efeito}
        </p>
        

      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <p className="hidden md:block text-sm text-gray-600">
          Previsão com as coordenadas específicas do CEEF
        </p>
        <p className="text-sm text-gray-600">
          Fonte: Open-Meteo API
        </p>
      </div>
    </div>
  );
}
