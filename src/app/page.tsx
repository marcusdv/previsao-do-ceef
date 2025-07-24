// Importação dos componentes de cards que exibem dados meteorológicos
import OpenWeatherCard from "../components/cards/OpenWeatherCard";
import AccuWeatherCard from "../components/cards/AccuWeatherCard";
import OpenMeteoCard from "../components/cards/OpenMeteoCard";
import MapaWrapper from "@/components/MapaWrapper";
import Image from "next/image";

// Serviços para buscar dados das APIs meteorológicas
import { getOpenweatherFridayForecast } from "@/services/openweather"
import { getAccuweatherFridayForecast } from "@/services/accuweather";
import { getOpenMeteoFridayForecast } from "@/services/openmeteo";

/**
 * Função utilitária para formatar datas no padrão brasileiro
 * @param dateString - String de data no formato ISO ou similar
 * @returns Data formatada como DD/MM/AAAA
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


/**
 * Componente principal da página Home
 * 
 * Responsabilidades:
 * - Buscar dados meteorológicos de 3 fontes diferentes (OpenWeather, AccuWeather, OpenMeteo)
 * - Renderizar cards com previsões para sexta-feira
 * - Tratar falhas de API de forma resiliente
 * 
 * Estratégia de resiliência:
 * - Usa Promise.allSettled para que falha em uma API não impeça as outras
 * - Renderização condicional: só mostra cards para APIs que retornaram dados
 * - Server-side rendering com cache inteligente dos serviços
 */
export default async function Home() {

  // Promise.allSettled garante que se uma API falhar, as outras continuam funcionando
  // Isso evita que o build quebre se uma API estiver instável
  const [openweatherResult, accuweatherResult, openmeteoResult] = await Promise.allSettled([
    getOpenweatherFridayForecast(),    // API OpenWeather (previsão 5 dias)
    getAccuweatherFridayForecast(),    // API AccuWeather (previsão 5 dias)
    getOpenMeteoFridayForecast()       // API OpenMeteo (previsão 7 dias)
  ]);

  // Extrai dados das APIs que tiveram sucesso, define null para as que falharam
  // Isso permite renderização parcial mesmo se algumas APIs estiverem indisponíveis
  const data = {
    openweatherData: openweatherResult.status === 'fulfilled' ? openweatherResult.value.openweatherData : null,
    accuweatherData: accuweatherResult.status === 'fulfilled' ? accuweatherResult.value.accuweatherData : null,
    openMeteoData: openmeteoResult.status === 'fulfilled' ? openmeteoResult.value.openMeteoData : null
  };

  console.log("Dados obtidos:", data.openMeteoData)

  return (
    // Container principal com altura mínima da tela
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 flex flex-col items-center justify-center">

        {/* Header com favicon e título */}
        <header className="flex items-center mb-2 mt-6 w-8/12 justify-center">
          <Image
            src="/favicon.ico"
            alt="CEEFguru Logo"
            width={32}
            height={32}
            className="mr-3"
          />
          {/* Título principal da aplicação */}
          <h1 className="text-4xl font-bold text-gray-800">CEEFguru</h1>
        </header>

        {/* Subtítulo com data da sexta-feira (se disponível) */}
        <h2 className="text-xl text-gray-600 mb-8 text-center w-10/12 md:w-full">
          Previsão do tempo para o vôlei de farmácia <span></span>
          {data.openMeteoData && data.openMeteoData[0]?.dataHora && (
            <>
              {data.openMeteoData[0].dataHora.split(",")[0]}
            </>
          )}
        </h2>



        {/* col-span-2 em xxl para layout lado a lado em telas muito grandes */}
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4 w-full max-w-11/12">

          {/* Renderização condicional: só mostra card se tiver dados */}
          {data.openMeteoData && <OpenMeteoCard data={data.openMeteoData} className={"col-span-2 "} />}
          {data.openweatherData && <OpenWeatherCard data={data.openweatherData} className={"col-span-2"} />}
          {data.accuweatherData && <AccuWeatherCard data={data.accuweatherData} className={"col-span-2"} />}
          {/* Componente do mapa com importação dinâmica */}
          <div className="w-full mb-8 px-4 col-span-2">
            <MapaWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}