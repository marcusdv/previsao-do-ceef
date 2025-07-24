'use client';
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
      if (desc.includes('limpo') || desc.includes('céu limpo'))
        // ☀️ Ensolarado
        return <i className="wi wi-day-sunny text-3xl text-yellow-600"></i>;
      if (desc.includes('nuvem') || desc.includes('nublado'))
        // ⛅ Parcialmente nublado
        return <i className="wi wi-day-cloudy text-3xl text-blue-400"></i>;
      if (desc.includes('chuva') || desc.includes('garoa'))
        // 🌦️ Chuvisco ou chuva leve
        return <i className="wi wi-day-showers text-3xl text-blue-500"></i>;
      // ⛅ Padrão otimista (parcialmente nublado)
      return <i className="wi wi-day-cloudy text-3xl text-blue-500"></i>;
    }

    // Para probabilidades altas (40% ou mais), mantenha os ícones originais
    if (desc.includes('tempestade'))
      // ⛈️ Tempestade
      return <i className="wi wi-day-thunderstorm text-3xl text-purple-500"></i>;
    if (desc.includes('chuva') || desc.includes('garoa'))
      // 🌧️ Chuva
      return <i className="wi wi-day-rain text-3xl text-blue-500"></i>;
    if (desc.includes('nuvem') || desc.includes('nublado'))
      // ☁️ Nublado
      return <i className="wi wi-day-cloudy text-3xl text-blue-500"></i>;
    if (desc.includes('limpo') || desc.includes('céu limpo'))
      // ☀️ Ensolarado
      return <i className="wi wi-day-sunny text-3xl text-yellow-500"></i>;
    if (desc.includes('neblina'))
      // 🌫️ Neblina
      return <i className="wi wi-day-fog text-3xl text-gray-400"></i>;
    // ⛅ Padrão (parcialmente nublado)
    return <i className="wi wi-day-cloudy text-3xl text-blue-500"></i>;
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
        icone: <i className="wi wi-wind-beaufort-0"></i>
      };
    } else if (windSpeed <= 15) {
      return {
        nivel: "Vento Fraco",
        cor: "text-blue-600",
        efeito: "Pouco efeito, pode desviar levemente bolas altas.",
        icone: <i className="wi wi-wind-beaufort-2"></i>
      };
    } else if (windSpeed <= 25) {
      return {
        nivel: "Vento Moderado",
        cor: "text-yellow-600",
        efeito: "Pode atrapalhar saques, passes e levantamentos.",
        icone: <i className="wi wi-wind-beaufort-4"></i>
      };
    } else if (windSpeed <= 35) {
      return {
        nivel: "Vento Forte",
        cor: "text-orange-600",
        efeito: "Dificulta controle da bola, aumenta erros e desvios.",
        icone: <i className="wi wi-wind-beaufort-6"></i>
      };
    } else {
      return {
        nivel: "Muito Forte",
        cor: "text-red-600",
        efeito: "Jogo prejudicado, difícil manter precisão e segurança.",
        icone: <i className="wi wi-wind-beaufort-8"></i>
      };
    }
  };

  const uvInfo = getUVInfo(avgUV);
  const windInfo = getWindInfo(avgWind);

  return (
    // acordeon
    <div className={`bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border border-amber-200/50 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">OpenMeteo</h3>
        <div className="bg-amber-100/80 backdrop-blur-sm text-amber-800 px-2 py-1 rounded text-sm font-medium shadow-sm">
          API Gratuita
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {/* Temperatura Média */}
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Temp. Média</h4>
          <p className="text-lg md:text-2xl font-bold text-amber-600">{avgTemp}°C</p>
        </div>

        {/* Máx. Chuva */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <h4 className="text-xs md:text-smfont-medium text-gray-600 mb-1">Máx. Chuva</h4>
          <p className="text-lg md:text-2xl font-bold text-yellow-600">{maxRain}%</p>
        </div>

        {/* Vento Médio */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">Vento Médio</h4>
          <p className="text-md md:text-2xl font-bold text-orange-600">{avgWind} km/h</p>
        </div>

        {/* UV Médio */}
        <div className="text-center p-3 bg-red-100 rounded-lg">
          <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">UV médio</h4>
          <p className="text-lg md:text-2xl font-bold text-red-600">{avgUV.toFixed(1)}</p>
        </div>
      </div>

      {/* Previsão por Horário */}
      <div className="mb-6">
        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
          <i className="wi wi-time-3 text-amber-600 mr-2"></i> Previsão Horária (12h às 19h)
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 xxl:grid-cols-8 gap-2">
          {data.map((item, index) => (
            // Renderiza cada item da previsão horária
            <div key={index} className="bg-amber-50 flex flex-col justify-center gap-0.5 p-3 rounded-lg text-center hover:bg-amber-100 transition-colors">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {formatTime(item.dataHora)}
              </div>
              <div className="text-xl mb-1">
                {getWeatherIcon(item.descricao, item.probabilidadeChuva || 0)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                {item.temperatura}°C
              </div>
              <div className="text-xs text-blue-600">
                <i className="wi wi-rain text-blue-600"></i> {item.probabilidadeChuva}%
              </div>
              <div className="text-xs text-orange-600">
                <i className="wi wi-strong-wind text-orange-600"></i> {item.velocidadeVento} km/h
              </div>
              <div className="text-xs text-stone-600">
                <i className="wi wi-hot text-stone-600"></i> {item.indiceUV !== null ? item.indiceUV.toFixed(1) : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condições Gerais */}
      <div className="bg-gradient-to-r from-orange-100/70 via-amber-100/70 to-yellow-100/70 backdrop-blur-sm border border-orange-200/50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">


          <h5 className="font-semibold text-gray-800 flex items-center">
            <i className="wi wi-day-cloudy text-orange-600 mr-2"></i> Condições do Dia
          </h5>
        </div>
        <p className="text-sm text-gray-700 mb-3 capitalize">
          {data[0]?.descricao}
        </p>

        {/* Informações de UV */}
        <div className="flex items-center mb-2">
          <h6 className="font-semibold text-gray-800 mr-2 flex items-center">
            <i className="wi wi-hot text-red-600 mr-1"></i> Índice UV:
          </h6>
          <span className={`font-bold ${uvInfo.cor}`}>
            {avgUV.toFixed(1)} - {uvInfo.nivel}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          {uvInfo.recomendacao}
        </p>

        {/* Informações do vento */}
        <div className="flex items-center mb-2">
          <h6 className="font-semibold text-gray-800 mr-2 flex items-center">
            <i className={`wi wi-strong-wind text-pink-600 mr-1`}></i> Vento:
          </h6>
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
          Previsão com as coordenadas do CEEF
        </p>
        <p className="text-sm text-gray-600">
          Fonte: Open-Meteo API
        </p>
      </div>
    </div>

  );
}
